import NodeChip from './NodeChip';

export default class AndChip extends NodeChip {
	constructor() {
		super(2, 1);
	}

	propogate() {
		const active = this.inputs[0] && this.inputs[1];
		for (let i = 0; i < this.outputs.length; i++) {
			this.setOutput(i, active);
		}
	}
}
