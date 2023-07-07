import {Gate} from './Gate';

export class NotGate extends Gate {
	constructor() {
		super(1, 1);
	}

	process() {
		const active = Boolean(!this.inputs[0]);
		this.setOutput(0, active);
	}
}
