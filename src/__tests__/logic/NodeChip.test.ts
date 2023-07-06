// TODO: all the tests...
// I'm just not really sure what they should be...

import {describe, expect, it, test} from 'vitest';
import AndChip from '../../logic/AndChip';
import NotChip from '../../logic/NotChip';
import NodeChip from '../../logic/NodeChip';

// !Temp
// (Just testing composibility)

describe('nand', () => {
	const truthTable = [
		// In1   In2    Output
		[false, false, true],
		[false, true, true],
		[true, false, true],
		[true, true, false],
	];

	const testFn = (inputA: boolean, inputB: boolean, result: boolean) => {
		const a = new AndChip();
		const n = new NotChip();
		const receiver = new NodeChip(1, 0);

		a.outputs[0].nodeInputs.push(([n, 0]));
		n.outputs[0].nodeInputs.push(([receiver, 0]));
		a.setInput(0, inputA);
		a.setInput(1, inputB);

		const output = receiver.inputs[0];
		expect(output).toBe(result);
	};

	test.each(truthTable)('%s	^& %s 	-> %s', testFn);
});
