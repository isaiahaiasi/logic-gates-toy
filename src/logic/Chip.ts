interface ChipPin {
	chip: Chip;
	pin: number; // Chip I/O index
}

interface Output {
	listeners: ChipPin[];
	state: boolean;
}

export default class Chip {
	inputs: boolean[];
	outputs: Output[];

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

		if (output.listeners.length === 0) {
			return;
		}

		output.listeners.forEach(({chip, pin}) => {
			chip.setInput(pin, active);
		});
	}

	setInput(input_idx: number, active: boolean) {
		if (input_idx >= this.inputs.length) {
			throw new Error('Invalid input index!');
		}

		this.inputs[input_idx] = active;
		this.process();
	}
}

