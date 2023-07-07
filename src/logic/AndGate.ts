import {Gate} from './Gate';

export class AndGate extends Gate {
	constructor() {
		super(2, 1);
	}

	process() {
		const active = Boolean(this.inputs[0] && this.inputs[1]);
		this.setOutput(0, active);
	}
}
