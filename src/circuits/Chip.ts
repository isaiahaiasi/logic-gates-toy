export abstract class Chip {
	inputCount: number;
	outputCount: number;

	outputState: boolean[];
	protected inputState: boolean[];

	/** Input pins connected to this chips ouput pins.
	 * @example [listeningChip0, listenerInputPin] = listeners[outputPinIdx][0]
	 */
	protected listeners: Array<Array<readonly [Chip, number]>>;

	constructor(inputCnt: number, outputCnt: number) {
		this.inputCount = inputCnt;
		this.outputCount = outputCnt;
		this.listeners = Array.from(Array(outputCnt), () => []);
		this.inputState = new Array(inputCnt).fill(false) as boolean[];
		this.outputState = new Array(outputCnt).fill(false) as boolean[];
	}

	addListener(outPin: number, chip: Chip, inPin: number) {
		if (outPin > this.outputCount) {
			throw new Error(`Could not add listener on output pin ${outPin}; pin does not exist!`);
		}

		const listener = [chip, inPin] as const;
		this.listeners[outPin].push(listener);
	}

	setOutput(outPin: number, active: boolean) {
		if (outPin > this.outputCount) {
			throw new Error(`Could not set output pin ${outPin} state; pin does not exist!`);
		}

		this.outputState[outPin] = active;

		for (const [listenerChip, listenerPin] of this.listeners[outPin]) {
			listenerChip.setInput(listenerPin, active);
		}
	}

	// Gates & ComplexChips implement this differently.
	abstract setInput(pin: number, active: boolean): void;
}
