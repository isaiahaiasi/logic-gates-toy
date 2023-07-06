import {describe, expect, test} from 'vitest';
import NotChip from '../../logic/NotChip';

describe('conforms to NOT truth table', () => {
	const truthTable = [
		// Input, Output
		[false, true],
		[true, false],
	];

	const tester = (inputA: boolean, result: boolean) => {
		const notChip = new NotChip();
		const receiver = new NotChip();
		notChip.outputs[0] = {nodeInputs: [[receiver, 0]], state: false};
		notChip.setInput(0, inputA);
		const output = receiver.inputs[0];
		expect(output).toBe(result);
	};

	test.each(truthTable)('^%s	-> %s', tester);
});
