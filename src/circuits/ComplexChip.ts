import {Chip} from './Chip';
import {RelayGate} from './Gate';

export abstract class ComplexChip extends Chip {
	private readonly inputRelay: RelayGate;
	private readonly outputRelay: RelayGate;

	constructor(inputCnt: number, outputCnt: number) {
		super(inputCnt, outputCnt);
		this.inputRelay = new RelayGate(inputCnt);
		this.outputRelay = new RelayGate(outputCnt);
		this.buildCircuit(this.inputRelay, this.outputRelay);
	}

	setInput(pin: number, active: boolean): void {
		if (pin >= this.inputCount) {
			throw new Error(`Invalid input index ${pin}!`);
		}

		this.inputRelay.setInput(pin, active);
	}

	abstract buildCircuit(inputRelay: RelayGate, outputRelay: RelayGate): void;
}
