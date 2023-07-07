import {Gate} from './Gate';

export class RelayGate extends Gate {
	constructor(relaySize: number) {
		super(relaySize, relaySize);
	}

	process() {
		this.inputs.forEach((inputState, i) => {
			this.setOutput(i, inputState);
		});
	}
}
