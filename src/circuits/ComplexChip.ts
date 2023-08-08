import {Chip} from './Chip';
import {type CircuitDescription} from './ComplexChipFactory';
import {RelayGate} from './Gate';

/** A chip with an internal circuit, which is generated at instantiation.
 * Is composed of other chips, and may be "stateful" (eg, a Latch).
 */
export abstract class ComplexChip extends Chip {
	// NOTE: It's not really necessary that these relays be full Chips.
	// NOTE: I just need the "inputs" & "outputs" to have the Chip interface.
	// NOTE: (really, I don't even need that--IN & OUT could be special cases in the Factory.)
	protected readonly inputRelay: RelayGate;
	protected readonly outputRelay: RelayGate;
	protected readonly abstract def: CircuitDescription;

	constructor(inputCnt: number, outputCnt: number) {
		super(inputCnt, outputCnt);
		this.inputRelay = new RelayGate(inputCnt);
		this.outputRelay = new RelayGate(outputCnt);
		this.buildCircuit();

		for (let i = 0; i < outputCnt; ++i) {
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

	abstract buildCircuit(): void;
}
