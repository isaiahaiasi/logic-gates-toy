/* eslint-disable @typescript-eslint/naming-convention */
import {describe, expect, test} from 'vitest';
import {AndGate, type GateName, NotGate, OrGate, RelayGate} from '../../circuits/Gate';
import {Chip} from '../../circuits/Chip';

class ListenerMock extends Chip {
	constructor() {
		super(1, 0);
	}

	setInput(pin: number, active: boolean) {
		this.outputState[pin] = active;
	}
}

const truthTables: Record<GateName, boolean[][]> = {
	AND: [
		// In1,  in2,   out
		[false, false, false],
		[false, true, false],
		[true, false, false],
		[true, true, true],
	],
	OR: [
		// In1,  in2,   out
		[false, false, false],
		[false, true, true],
		[true, false, true],
		[true, true, true],
	],
	NOT: [
		// In,  out
		[false, true],
		[true, false],
	],
	RELAY: [
		// In,  out
		[true, true],
		[false, false],
	],
};

describe('Gate', () => {
	test('sends signal to listeners when output changes', () => {
		const listener = new ListenerMock();
		const gate = new AndGate();

		gate.addListener(0, listener, 0);
		gate.setInput(0, true);
		gate.setInput(1, true);

		expect(listener.outputState).toEqual([true]);
	});
});

describe('AND gate conforms to AND truth table', () => {
	const testRow = (a: boolean, b: boolean, expected: boolean) => {
		const and = new AndGate();

		and.setInput(0, a);
		and.setInput(1, b);
		expect(and.outputState).toEqual([expected]);
	};

	test.each(truthTables.AND)('%d & %d -> %d', testRow);
});

describe('OR gate conforms to OR truth table', () => {
	const testRow = (a: boolean, b: boolean, expected: boolean) => {
		const or = new OrGate();

		or.setInput(0, a);
		or.setInput(1, b);
		expect(or.outputState).toEqual([expected]);
	};

	test.each(truthTables.OR)('%d | %d -> %d', testRow);
});

describe('NOT gate conforms to AND truth table', () => {
	const testRow = (a: boolean, expected: boolean) => {
		const not = new NotGate();

		not.setInput(0, a);
		expect(not.outputState).toEqual([expected]);
	};

	test.each(truthTables.NOT)('!%d -> %d', testRow);
});

describe('RELAY gate conforms to idenity truth table', () => {
	const testRow = (a: boolean, expected: boolean) => {
		const relay = new RelayGate();

		relay.setInput(0, a);
		expect(relay.outputState).toEqual([expected]);
	};

	test.each(truthTables.RELAY)('%d -> %d', testRow);
});
