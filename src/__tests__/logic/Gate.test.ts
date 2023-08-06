/* eslint-disable @typescript-eslint/naming-convention */
import {describe, expect, test} from 'vitest';
import {AndGate, type GateName, NotGate, OrGate, RelayGate} from '../../circuits/Gate';
import {Chip} from '../../circuits/Chip';

class ListenerMock extends Chip {
	constructor() {
		super(1, 1);
	}

	setInput(pin: number, active: boolean) {
		this.setOutput(pin, active);
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
};

describe('Gate', () => {
	test('sends signal to listeners when output changes', () => {
		const listener = new ListenerMock();
		const gate = new AndGate();

		gate.addListener(0, ['listener', active => {
			listener.setInput(0, active);
		}]);

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

describe('Relay Gate conforms to idenity behavior', () => {
	// Tests single input->output states for difference relay sizes
	test.each([1, 2, 3])('Relay size: %i', n => {
		const relay = new RelayGate(n);
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				relay.setInput(j, false);
			}

			relay.setInput(i, true);

			for (let j = 0; j < n; j++) {
				const result = j === i;
				expect(relay.outputState[j]).toBe(result);
			}
		}
	});
});
