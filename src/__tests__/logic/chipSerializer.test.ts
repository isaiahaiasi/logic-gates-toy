import {describe, expect, test} from 'vitest';
import {type ChipDefinitionObject, deserializeChip} from '../../logic/chipSerializer';

describe('Chip de-serialization', () => {
	describe('deserializes with correct number of inputs/outputs', () => {
		const codes: Array<[number, number]> = [
			[0, 1],
			[3, 0],
			[30, 30],
		];

		test.each(codes)('%i/%i', (resIn, resOut) => {
			const definitionObj = {
				io: [resIn, resOut],
				chips: {},
				edges: [],
			} satisfies ChipDefinitionObject;

			const chip = deserializeChip(definitionObj);
			expect(chip.inputs.length).toBe(resIn);
			expect(chip.outputs.length).toBe(resOut);
		});
	});

	describe('deserializes custom "swap" circuit', () => {
		const truthTable = [
			[false, false, false, false],
			[false, true, true, false],
			[true, false, false, true],
			[true, true, true, true],
		];

		const swapCircuitDefinitionObj = {
			io: [2, 2],
			chips: {},
			edges: [
				['IN', 0, 'OUT', 1],
				['IN', 1, 'OUT', 0],
			],
		} satisfies ChipDefinitionObject;

		test.each(truthTable)('[%s %s] -> [%s %s]', (in1, in2, out1, out2) => {
			const chip = deserializeChip(swapCircuitDefinitionObj);
			chip.setInput(0, in1);
			chip.setInput(1, in2);
			expect(chip.outputs[0].state).toBe(out1);
			expect(chip.outputs[1].state).toBe(out2);
		});
	});

	describe('deserializes NAND circuit', () => {
		const truthTable = [
			// In1   In2    Output
			[false, false, true],
			[false, true, true],
			[true, false, true],
			[true, true, false],
		];

		const defObj = {
			io: [2, 1],
			chips: {
				a: 'AND',
				n: 'NOT',
			},
			edges: [
				['IN', 0, 'a', 0],
				['IN', 1, 'a', 1],
				['a', 0, 'n', 0],
				['n', 0, 'OUT', 0],
			],
		} satisfies ChipDefinitionObject;

		test.each(truthTable)('%d ^& %d -> %d', (in1, in2, res) => {
			const nand = deserializeChip(defObj);
			nand.setInput(0, in1);
			nand.setInput(1, in2);
			const output = nand.outputs[0].state;
			expect(output).toBe(res);
		});
	});
});
