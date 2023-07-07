import {describe, expect, test} from 'vitest';
import {AndGate} from '../../logic/AndGate';
import {NotGate} from '../../logic/NotGate';
import {RelayGate} from '../../logic/RelayGate';
import {type ChipPin} from '../../logic/CircuitElement';

const nandChip = () => {
	const inGate = new RelayGate(2);
	const outGate = new RelayGate(1);
	const a = new AndGate();
	const n = new NotGate();
	inGate.addListener(0, {chip: a, pin: 0});
	inGate.addListener(1, {chip: a, pin: 1});
	a.addListener(0, {chip: n, pin: 0});
	n.addListener(0, {chip: outGate, pin: 0});

	return {
		setInput(idx: number, active: boolean) {
			inGate.setInput(idx, active);
		},
		addListener(idx: number, listener: ChipPin) {
			outGate.addListener(idx, listener);
		},
		outputs: outGate.outputs,
	};
};

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
		const nand = nandChip();
		nand.setInput(0, inputA);
		nand.setInput(1, inputB);
		const output = nand.outputs[0].state;
		expect(output).toBe(result);
	};

	test.each(truthTable)('%s	^& %s 	-> %s', testFn);
});
