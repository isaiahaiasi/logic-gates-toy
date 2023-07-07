import NodeChip from './Chip';

export default class AndChip extends NodeChip {
	constructor() {
		super(2, 1);
	}

	process() {
		const active = Boolean(this.inputs[0] && this.inputs[1]);
		this.setOutput(0, active);
	}
}
