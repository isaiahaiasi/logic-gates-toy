import {describe, expect, test} from 'vitest';
import {AndGate} from '../../logic/AndGate';
import {NotGate} from '../../logic/NotGate';
import {ComplexChip} from '../../logic/ComplexChip';

describe('ComplexCircuit processes circuit of gates and exposes result as output (NAND example)', () => {
	// For stuff like this, maybe use composition to create a box around these instances
	// & bind the inputs & outputs
	const truthTable = [
		// In1   In2    Output
		[false, false, true],
		[false, true, true],
		[true, false, true],
		[true, true, false],
	];

	const getNand = () => new ComplexChip(2, 1, (inGate, outGate) => {
		const a = new AndGate();
		const n = new NotGate();
		inGate.addListener(0, {chip: a, pin: 0});
		inGate.addListener(1, {chip: a, pin: 1});
		a.addListener(0, {chip: n, pin: 0});
		n.addListener(0, {chip: outGate, pin: 0});
	});

	const testFn = (inputA: boolean, inputB: boolean, result: boolean) => {
		const nand = getNand();
		nand.setInput(0, inputA);
		nand.setInput(1, inputB);
		const output = nand.outputs[0].state;
		expect(output).toBe(result);
	};

	test.each(truthTable)('%s	^& %s 	-> %s', testFn);
});
