import {type ChipPin, type OutputInfo, type Chip} from './Chip';
import {RelayGate} from './RelayGate';

export class ComplexChip implements Chip {
	inputs: boolean[];
	outputs: OutputInfo[];
	inputRelay: RelayGate;

	constructor(
		inputCnt: number,
		outputCnt: number,
		initialize: (inputChip: RelayGate, outputChip: RelayGate) => void,
	) {
		this.inputRelay = new RelayGate(inputCnt);
		const outputRelay = new RelayGate(outputCnt);
		this.inputs = this.inputRelay.inputs;
		this.outputs = outputRelay.outputs;

		initialize(this.inputRelay, outputRelay);
	}

	addListener(outputPin: number, listener: ChipPin) {
		if (outputPin >= this.outputs.length) {
			throw new Error('Invalid output index!');
		}

		this.outputs[outputPin].listeners.push(listener);
	}

	setInput(inputPin: number, active: boolean): void {
		if (inputPin >= this.inputs.length) {
			throw new Error('Invalid input index!');
		}

		this.inputRelay.setInput(inputPin, active);
	}
}
