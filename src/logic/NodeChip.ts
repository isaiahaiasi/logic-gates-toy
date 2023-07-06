export default class NodeChip {
	inputs: boolean[];
	outputs: Array<[NodeChip, number] | undefined>;

	constructor(input_cnt: number, output_cnt: number) {
		this.inputs = new Array<boolean>(input_cnt).fill(false);
		this.outputs = new Array<undefined>(output_cnt);
	}

	propogate() {
		// Stub method, to be extended
		this.outputs.forEach((output, i) => {
			if (!Array.isArray(output)) {
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

		if (!Array.isArray(output)) {
			return;
		}

		const [node, inputIdx] = output;
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

