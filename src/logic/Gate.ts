import {type OutputInfo, type Chip, type ChipPin} from './CircuitElement';

export class Gate implements Chip {
	inputs: boolean[];
	outputs: OutputInfo[];

	constructor(inputCnt: number, outputCnt: number) {
		this.inputs = new Array<boolean>(inputCnt).fill(false);
		this.outputs = new Array<undefined>(outputCnt)
			.fill(undefined)
			.map(() => ({listeners: [], state: false}));
	}

	addListener(outputIdx: number, listener: ChipPin) {
		this.outputs[outputIdx].listeners.push(listener);
	}

	process() {
		// Stub method, to be extended
		this.outputs.forEach((output, i) => {
			if (output.listeners.length === 0) {
				return;
			}

			this.setOutput(i, true);
		});
	}

	setOutput(output_idx: number, active: boolean) {
		if (output_idx >= this.outputs.length) {
			throw new Error('Invalid output index!');
		}

		const output = this.outputs[output_idx];

		output.state = active;

		for (const listener of output.listeners) {
			listener.chip.setInput(listener.pin, active);
		}
	}

	setInput(input_idx: number, active: boolean): void {
		if (input_idx >= this.inputs.length) {
			throw new Error('Invalid input index!');
		}

		this.inputs[input_idx] = active;
		this.process();
	}
}
