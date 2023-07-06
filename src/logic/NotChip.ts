import NodeChip from './NodeChip';

export default class NotChip extends NodeChip {
	constructor() {
		super(1, 1);
	}

	process() {
		const active = Boolean(!this.inputs[0]);
		this.setOutput(0, active);
	}
}
