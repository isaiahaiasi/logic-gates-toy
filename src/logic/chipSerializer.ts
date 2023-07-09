
/* eslint-disable @typescript-eslint/naming-convention */
import {AndGate} from './AndGate';
import {type Chip} from './Chip';
import {ComplexChip} from './ComplexChip';
import {type Gate} from './Gate';
import {NotGate} from './NotGate';
import {type RelayGate} from './RelayGate';

type PureChipConstructor = new () => Gate | ComplexChip;

export interface ChipDefinitionObject {
	io: [number, number];
	chips: Record<string, string>;
	edges: Array<[string, number, string, number]>;
}

const GateLib = {
	AND: AndGate,
	NOT: NotGate,
};

function mapObject<V, VR>(
	obj: Record<string, V>,
	mapFn: (entry: [k: string, v: V]) => [string, VR],
): Record<string, VR> {
	return Object.fromEntries(Object.entries<V>(obj)
		.map(mapFn));
}

export class ChipDeserializer {
	#chipLib: Record<string, PureChipConstructor>;

	constructor(chipLib = {}) {
		this.#chipLib = chipLib;
	}

	deserializeChips<K extends string>(
		defs: Record<K, ChipDefinitionObject>,
	): Record<K, PureChipConstructor> {
		// 1. Get list of chips
		// NOTE: Currently, because constructors are not run at "compile" time,
		// NOTE: there is no sorting based on dependencies (ie, if the definition of OR requires chipLib.NAND).
		// NOTE: If this were to change, you would want to Topologically Sort chipNames
		// NOTE: before generating the constructors.
		const chipNames = Object.keys(defs) as K[];

		// 2. Process each def in order,
		//    adding the chip constructor to #chipLib if it's not already there.
		return Object.fromEntries(chipNames.map(k => {
			const Constructor = this.#chipFactory(defs[k]);

			if (!(k in this.#chipLib)) {
				this.#chipLib[k] = Constructor;
			}

			return [k, Constructor];
		})) as Record<K, PureChipConstructor>;
	}

	deserializeChip(
		def: ChipDefinitionObject,
	) {
		const ChipConstructor = this.#chipFactory(def);
		return new ChipConstructor();
	}

	#chipFactory(def: ChipDefinitionObject) {
		const chipGenerator = (_in: RelayGate, _out: RelayGate) => {
			this.#chipGenerator(def, _in, _out);
		};

		return class GeneratedChip extends ComplexChip {
			constructor() {
				super(
					def.io[0],
					def.io[1],
					chipGenerator,
				);
			}
		};
	}

	#chipGenerator(
		def: ChipDefinitionObject,
		IN: RelayGate,
		OUT: RelayGate): void {
		const chips: Record<string, Chip> = {
			IN,
			OUT,
			...mapObject(def.chips, ([id]) => {
				let ChipConstructor;

				if (def.chips[id] in GateLib) {
					const constructorId = def.chips[id] as keyof typeof GateLib;
					ChipConstructor = GateLib[constructorId];
				} else if (def.chips[id] in this.#chipLib) {
					const constructorId = def.chips[id];
					ChipConstructor = this.#chipLib[constructorId];
				}

				if (!ChipConstructor) {
					throw new Error(`Invalid chip name ${id}: ${def.chips[id]}`);
				}

				return [id, new ChipConstructor()];
			}),
		};

		def.edges.forEach(([inId, inPin, outId, outPin]) => {
			if (!chips[inId]) {
				throw new Error(`Could not find chip ${inId}`);
			}

			if (!chips[outId]) {
				throw new Error(`Could not find chip ${outId}`);
			}

			const inChip = chips[inId];
			const outChip = chips[outId];

			inChip.addListener(inPin, {chip: outChip, pin: outPin});
		});
	}
}
