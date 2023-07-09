
/* eslint-disable @typescript-eslint/naming-convention */
import {AndGate} from './AndGate';
import {type Chip} from './Chip';
import {ComplexChip} from './ComplexChip';
import {type Gate} from './Gate';
import {NotGate} from './NotGate';
import {type RelayGate} from './RelayGate';

type PureChipConstructor = new () => Gate | ComplexChip;

// The Chip Definitions use `IN` `OUT` to reference IO chips,
// so the ComplexChip's IO relays must be present by those names
interface LocalChipRefs {
	[k: string]: Chip;
	IN: RelayGate;
	OUT: RelayGate;
}

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
	// NOTE: Might want wrap this with an immutable getter to protect it.
	chips: Record<string, PureChipConstructor>;

	constructor(chipLib = {}) {
		this.chips = chipLib;
	}

	deserializeChips<K extends string>(
		defs: Record<K, ChipDefinitionObject>,
	): Record<K, PureChipConstructor> {
		// NOTE: Chips only need their dependent constructors to exist at *instantiation*
		// NOTE: (because that's when the `chipGenerator` function runs),
		// NOTE: so we can create all the constructors in whatever order
		// NOTE: and **ASSUME** that all dependencies will be defined by then.
		// NOTE: If we wanted/needed to actually verify the depency DAG (directed acyclic graph),
		// NOTE: we would need to create a topological sorting.
		const chipNames = Object.keys(defs) as K[];

		return Object.fromEntries(chipNames.map(k => {
			const Constructor = this.deserializeChip(k, defs[k]);
			return [k, Constructor];
		})) as Record<K, PureChipConstructor>;
	}

	deserializeChip(
		name: string,
		def: ChipDefinitionObject,
	): PureChipConstructor {
		// Allow chips to be over-written.
		if (name in this.chips) {
			console.warn(`Chip ${name} already defined!`);
		}

		const chipGenerator = (_in: RelayGate, _out: RelayGate) => {
			this.#chipGenerator(def, _in, _out);
		};

		const ChipConstructor = class GeneratedChip extends ComplexChip {
			constructor() {
				super(
					def.io[0],
					def.io[1],
					chipGenerator,
				);
			}
		};

		this.chips[name] = ChipConstructor;

		return ChipConstructor;
	}

	#chipGenerator(
		def: ChipDefinitionObject,
		IN: RelayGate,
		OUT: RelayGate): void {
		const chips: LocalChipRefs = {
			IN,
			OUT,
			...mapObject(def.chips, ([id]) => {
				let ChipConstructor;

				// Get Constructor from GateLib key or local chips key,
				// without TypeScript yelling about key types.
				if (def.chips[id] in GateLib) {
					const constructorId = def.chips[id] as keyof typeof GateLib;
					ChipConstructor = GateLib[constructorId];
				} else if (def.chips[id] in this.chips) {
					const constructorId = def.chips[id];
					ChipConstructor = this.chips[constructorId];
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
