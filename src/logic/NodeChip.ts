type NodeInput = [NodeChip, number];

interface Output {
	nodeInput?: NodeInput;
	state: boolean;
}

export default class NodeChip {
	inputs: boolean[];
	outputs: Output[];

	constructor(inputCnt: number, outputCnt: number) {
		this.inputs = new Array<boolean>(inputCnt).fill(false);
		this.outputs = new Array<undefined>(outputCnt)
			.fill(undefined)
			.map(() => ({state: false}));
	}

	propogate() {
		// Stub method, to be extended
		this.outputs.forEach((output, i) => {
			if (!output.nodeInput) {
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

		if (!Array.isArray(output.nodeInput)) {
			return;
		}

		const [node, inputIdx] = output.nodeInput;
		node.setInput(inputIdx, active);
	}

	setInput(input_idx: number, active: boolean) {
		if (input_idx >= this.inputs.length) {
			throw new Error('Invalid input index!');
		}

		this.inputs[input_idx] = active;
		this.propogate();
	}
}

