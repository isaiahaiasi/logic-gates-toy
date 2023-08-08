import {type PinListener, PinArray} from './PinArray';

export abstract class Chip {
	inputCount: number;

	protected outputPins: PinArray;

	constructor(inputCnt: number, outputCnt: number) {
		this.inputCount = inputCnt;
		this.outputPins = new PinArray(outputCnt);
	}

	get outputCount() {
		return this.outputPins.length;
	}

	get outputState() {
		return this.outputPins.state;
	}

	addWire(
		outPin: number,
		listener: PinListener,
	) {
		// NOTE: We need to send the signal right when we connect.
		// TODO: Probably want to re-think this "pin array listeners" abstraction.
		listener[1](this.outputState[outPin]);

		this.outputPins.addListener(outPin, listener);
	}

	removeWire(pin: number, listenerId: string): boolean {
		return this.outputPins.removeListener(pin, listenerId);
	}

	// Gates & ComplexChips implement this differently.
	abstract setInput(pin: number, active: boolean): void;

	protected setOutput(pin: number, active: boolean) {
		this.outputPins.sendSignal(pin, active);
	}
}
