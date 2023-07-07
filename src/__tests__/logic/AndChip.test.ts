import {describe, expect, test} from 'vitest';
import AndChip from '../../logic/AndChip';

describe('AND chip conforms to AND truth table', () => {
	const truthTable = [
		// In1,  in2,   out
		[false, false, false],
		[false, true, false],
		[true, false, false],
		[true, true, true],
	];

	const testRow = (a: boolean, b: boolean, expected: boolean) => {
		const and = new AndChip();
		const receiver = new AndChip();
		and.outputs[0] = {listeners: [{chip: receiver, pin: 0}], state: false};
		and.setInput(0, a);
		and.setInput(1, b);
		const output = receiver.inputs[0];
		expect(output).toBe(expected);
	};

	test.each(truthTable)('%s	& %s	-> %s', testRow);
});
