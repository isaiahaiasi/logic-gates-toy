/* eslint-disable @typescript-eslint/naming-convention */
import {Chip} from './Chip';

/** A "Gate" is a stateless circuit that does not itself contain any chips. */
abstract class Gate extends Chip {
	setInput(pin: number, active: boolean) {
		if (pin >= this.inputCount) {
			throw new Error(`Could not set input pin ${pin} state; pin does not exist!`);
		}

		this.inputState[pin] = active;
		const newState = this.getState();
		for (let i = 0; i < newState.length; ++i) {
			if (this.outputState[i] !== newState[i]) {
				this.setOutput(i, newState[i]);
			}
		}
	}

	/** Given the current input state, returns what the output state should be. */
	// There's a layer of indirection here to hide the calling of setOutput,
	// because there is extra logic to avoid unnecessary calls that I don't want
	// to expose to the concrete classes.
	abstract getState(): boolean[];
}

export class AndGate extends Gate {
	constructor() {
		super(2, 1);
	}

	getState(): boolean[] {
		const [a, b] = this.inputState;
		return [a && b];
	}
}

export class OrGate extends Gate {
	constructor() {
		super(2, 1);
	}

	getState(): boolean[] {
		const [a, b] = this.inputState;
		return [a || b];
	}
}

export class NotGate extends Gate {
	constructor() {
		super(1, 1);
	}

	getState(): boolean[] {
		const [state] = this.inputState;
		return [!state];
	}
}

export const gateConstructors = {
	AND: AndGate,
	NOT: NotGate,
	OR: OrGate,
};

export type GateName = keyof typeof gateConstructors;
