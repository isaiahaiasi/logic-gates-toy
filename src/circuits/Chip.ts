import {type PinListener, PinArray} from './PinArray';

export abstract class Chip {
	inputCount: number;

	/** Input pins connected to this chips ouput pins.
	 * @example [listeningChip0, listenerInputPin] = listeners[outputPinIdx][0]
	 */
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

	addListener(
		outPin: number,
		listener: PinListener,
	) {
		this.outputPins.addListener(outPin, listener);
	}

	removeListener(pin: number, listenerId: string): boolean {
		return this.outputPins.removeListener(pin, listenerId);
	}

	setOutput(pin: number, active: boolean) {
		this.outputPins.sendSignal(pin, active);
	}

	// Gates & ComplexChips implement this differently.
	abstract setInput(pin: number, active: boolean): void;
}
