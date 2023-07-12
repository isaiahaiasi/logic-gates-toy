/* eslint-disable @typescript-eslint/naming-convention */
import {describe, expect, test} from 'vitest';
import {getGateOutput, gates} from '../../logic/ChipDef';

const truthTables = {
	AND: [
		[false, false, false],
		[false, true, false],
		[true, false, false],
		[true, true, true],
	],
	NOT: [
		[false, true],
		[true, false],
	],
};

test('getGateOutput throws on invalid number of inputs', () => {
	expect(() => getGateOutput(gates.AND, [])).toThrowError();
	expect(() => getGateOutput(gates.AND, [false])).toThrowError();
	expect(() => getGateOutput(gates.AND, [true])).toThrowError();
	expect(() => getGateOutput(gates.AND, [true, true, false])).toThrowError();
	expect(() => getGateOutput(gates.AND, [true, true])).not.toThrowError();
});

describe('getGateOutput', () => {
	test.each(truthTables.AND)('%d & %d -> %d', (in1, in2, out) => {
		const res = getGateOutput(gates.AND, [in1, in2]);
		expect(res).toEqual(out);
	});

	test.each(truthTables.NOT)('~%d -> %d', (_in, _out) => {
		const res = getGateOutput(gates.NOT, [_in]);
		expect(res).toEqual(_out);
	});
});
