import {arrayFromUnique} from '../utils/objectHelpers';

export type PinListener = readonly [string, (active: boolean) => void];

/**
 * Tracks state of a set of pins, and provides an PubSub-style interface to
 * track updates to an individual pin's state.
 */
export class PinArray {
	listeners: PinListener[][];
	state: boolean[];

	constructor(size: number) {
		this.listeners = arrayFromUnique(size, () => []);
		this.state = new Array<boolean>(size).fill(false);
	}

	get length() {
		return this.listeners.length;
	}

	addListener(pin: number, listener: PinListener) {
		if (pin > this.length) {
			throw new Error(`Could not add listener on output pin ${pin}; pin does not exist!`);
		}

		this.listeners[pin].push(listener);
	}

	removeListener(pin: number, listenerId: string) {
		if (pin > this.length) {
			throw new Error(`Could not remove listener from output pin ${pin}; pin does not exist!`);
		}

		const listenerIdx = this.listeners[pin].findIndex(([id]) => id === listenerId);

		if (listenerIdx === -1) {
			return false;
		}

		this.listeners.splice(listenerIdx, 1);
		return true;
	}

	sendSignal(pin: number, active: boolean) {
		if (pin > this.length) {
			throw new Error(`Could not send signal from output pin ${pin}; pin does not exist!`);
		}

		this.state[pin] = active;
		this.listeners[pin].forEach(([, listenerFn]) => {
			listenerFn(active);
		});
	}
}
