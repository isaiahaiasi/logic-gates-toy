import {describe, expect, test} from 'vitest';
import {AndGate} from '../../logic/AndGate';
import {NotGate} from '../../logic/NotGate';
import {Gate} from '../../logic/Gate';

// (Just testing composibility)
describe('nand', () => {
	// For stuff like this, maybe use composition to create a box around these instances
	// & bind the inputs & outputs
	const truthTable = [
		// In1   In2    Output
		[false, false, true],
		[false, true, true],
		[true, false, true],
		[true, true, false],
	];

	const testFn = (inputA: boolean, inputB: boolean, result: boolean) => {
		const a = new AndGate();
		const n = new NotGate();
		const receiver = new Gate(1, 0);

		a.outputs[0].listeners.push({gate: n, pin: 0});
		n.outputs[0].listeners.push({gate: receiver, pin: 0});
		a.setInput(0, inputA);
		a.setInput(1, inputB);

		const output = receiver.inputs[0];
		expect(output).toBe(result);
	};

	test.each(truthTable)('%s	^& %s 	-> %s', testFn);
});
