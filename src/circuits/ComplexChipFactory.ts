/* eslint-disable @typescript-eslint/naming-convention */
import {ComplexChip} from '../circuits/ComplexChip';
import {mapObject} from '../utils/objectHelpers';
import {type Chip} from './Chip';
import {gateConstructors} from './Gate';

/** A serializable description of a "Circuit",
 * which can be used to construct a ComplexChip. */
export interface CircuitDescription {
	typeId: string;
	inputCount: number;
	outputCount: number;
	chips: Record<string, string>;
	wires: Array<[string, number, string, number]>;
}

/** A "nullary" function takes no arguments. */
type NullaryChipConstructor = new () => Chip;

export class ComplexChipFactory {
	chips: Record<string, NullaryChipConstructor>;

	constructor() {
		this.chips = {...gateConstructors};
	}

	buildChip(def: CircuitDescription, overwrite = false) {
		// Do not allow chips to be re-defined without flag.
		if (!overwrite && def.typeId in this.chips) {
			throw new Error(`Chip ${def.typeId} already defined!`);
		}

		// Need to wrap this in a callback to avoid losing `this` context.
		const initialize = (
			def: CircuitDescription,
			IN: Chip,
			OUT: Chip,
		) => {
			this.buildChipInternals(def, IN, OUT);
		};

		const NewComplexChip = class PureComplexChip extends ComplexChip {
			def = def;

			constructor() {
				super(def.inputCount, def.outputCount);
			}

			buildCircuit() {
				initialize(def, this.inputRelay, this.outputRelay);
			}
		};

		this.chips[def.typeId] = NewComplexChip;

		return NewComplexChip;
	}

	// "Wires up" internals of chip based on the given description object.
	// NOTE: Because this is only called when the chip is instantiated,
	// NOTE: the order chip constructors are "built" does not matter.
	// NOTE: (eg, if Chip A depends on Chip B)
	// NOTE: If I want to add "build-time" validation in the future, I would
	// NOTE: probably use a topological sort to resolve the dependency graph.
	private buildChipInternals(
		def: CircuitDescription,
		IN: Chip,
		OUT: Chip,
	) {
		const internalChips: Record<string, Chip> = {
			IN,
			OUT,
			...mapObject(def.chips, ([instanceId, typeId]) => {
				if (!(typeId in this.chips)) {
					throw new Error(`Could not find chip of typeId ${typeId}!`);
				}

				const chip = new this.chips[typeId]();

				return [instanceId, chip];
			}),
		};

		def.wires.forEach(([outputChipId, outputPin, inputChipId, inputPin]) => {
			const outputChip = internalChips[outputChipId];
			const inputChip = internalChips[inputChipId];

			if (!outputChip) {
				throw new Error(`Could not find chip ${outputChipId}`);
			}

			if (!inputChip) {
				throw new Error(`Could not find chip ${inputChipId}`);
			}

			outputChip.addWire(outputPin, [inputChipId, active => {
				inputChip.setInput(inputPin, active);
			}]);
		});
	}
}
