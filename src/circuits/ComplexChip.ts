/* eslint-disable @typescript-eslint/naming-convention */
import {mapObject} from '../utils/objectHelpers';
import {Chip} from './Chip';
import {type CircuitDescription} from './CircuitDescription';
import {RelayGate, gateConstructors} from './Gate';

/** A "nullary" function takes no arguments. */
type NullaryChipConstructor = new () => Chip;

/** A chip with an internal circuit, which is generated at instantiation.
 * Is composed of other chips, and may be "stateful" (eg, a Latch).
 */
export class ComplexChip extends Chip {
	private readonly def: CircuitDescription;
	private readonly chipConstructors: Record<string, NullaryChipConstructor>;

	// NOTE: It's not really necessary that these relays be full Chips.
	// NOTE: I just need the "inputs" & "outputs" to have the Chip interface.
	private readonly inputRelay: RelayGate;
	private readonly outputRelay: RelayGate;

	constructor(
		def: CircuitDescription,
		chipConstructors: Record<string, NullaryChipConstructor> = gateConstructors,
	) {
		super(def.inputCount, def.outputCount);
		this.inputRelay = new RelayGate(def.inputCount);
		this.outputRelay = new RelayGate(def.outputCount);
		this.def = def;
		this.chipConstructors = chipConstructors;

		this.buildCircuit();

		// Update this Chip's output state to reflect its outputRelay's state.
		for (let i = 0; i < def.outputCount; ++i) {
			this.outputRelay.addWire(0, ['complex_chip_output_wrapper', active => {
				this.setOutput(i, active);
			}]);
		}
	}

	get outputState() {
		return this.outputRelay.outputState;
	}

	setInput(pin: number, active: boolean): void {
		this.inputRelay.setInput(pin, active);
	}

	/** "Wires up" internals of chip based on its CircuitDescription. */
	// NOTE: Because this is only called when the chip is instantiated,
	// NOTE: the order chip constructors are "built" does not matter.
	// NOTE: (eg, if Chip A depends on Chip B)
	// NOTE: If I want to add "build-time" validation in the future, I would
	// NOTE: probably use a topological sort to resolve the dependency graph.
	buildCircuit() {
		const internalChips: Record<string, Chip> = {
			IN: this.inputRelay,
			OUT: this.outputRelay,
			...mapObject(this.def.chips, ([instanceId, typeId]) => {
				if (!(typeId in this.chipConstructors)) {
					throw new Error(`Could not find chip of typeId ${typeId}!`);
				}

				const chip = new this.chipConstructors[typeId]();

				return [instanceId, chip];
			}),
		};

		this.def.wires.forEach(([outputChipId, outputPin, inputChipId, inputPin]) => {
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
