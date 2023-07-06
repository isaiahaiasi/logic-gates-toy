import {expect, test} from 'vitest';
import AndChip from '../../logic/AndChip';

test('conforms to AND truth table', () => {
	const truthTable = [
		[false, false, false],
		[false, true, false],
		[true, false, false],
		[true, true, true],
	];

	truthTable.forEach(([inputA, inputB, result]) => {
		const and = new AndChip();
		const receiver = new AndChip();
		and.outputs = [{nodeInput: [receiver, 0], state: false}];
		and.setInput(0, inputA);
		and.setInput(1, inputB);
		const output = receiver.inputs[0];
		expect(output).toBe(result);
	});
});
