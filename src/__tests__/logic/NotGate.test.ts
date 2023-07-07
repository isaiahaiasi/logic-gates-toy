import {describe, expect, test} from 'vitest';
import {NotGate} from '../../logic/NotGate';

describe('NOT chip conforms to NOT truth table', () => {
	const truthTable = [
		// Input, Output
		[false, true],
		[true, false],
	];

	const testRow = (inputA: boolean, result: boolean) => {
		const notChip = new NotGate();
		const receiver = new NotGate();
		notChip.outputs[0] = {listeners: [{chip: receiver, pin: 0}], state: false};
		notChip.setInput(0, inputA);
		const output = receiver.inputs[0];
		expect(output).toBe(result);
	};

	test.each(truthTable)('^%s	-> %s', testRow);
});
