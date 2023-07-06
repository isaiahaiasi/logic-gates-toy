type NodeInput = [NodeChip, number]; // Number is the node's input index

interface Output {
	nodeInputs: NodeInput[];
	state: boolean;
}

export default class NodeChip {
	inputs: boolean[];
	outputs: Output[];

	constructor(inputCnt: number, outputCnt: number) {
		this.inputs = new Array<boolean>(inputCnt).fill(false);
		this.outputs = new Array<undefined>(outputCnt)
			.fill(undefined)
			.map(() => ({nodeInputs: [], state: false}));
	}

	process() {
		// Stub method, to be extended
		this.outputs.forEach((output, i) => {
			if (!output.nodeInputs.length) {
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

		if (!output.nodeInputs.length) {
			return;
		}

		output.nodeInputs.forEach(([node, inputIdx]) => {
			node.setInput(inputIdx, active);
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

