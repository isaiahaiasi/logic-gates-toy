/* eslint-disable @typescript-eslint/naming-convention */
import {describe, expect, test} from 'vitest';
import {type ChipDefinitionObject, ChipDeserializer} from '../../logic/chipSerializer';

type TruthTable = Array<Array<boolean | number>>;

interface ChipExample {
	table: TruthTable;
	def: ChipDefinitionObject;
}

const chipExamples: Record<string, ChipExample> = {
	nand: {
		table: [
			[0, 0, 1],
			[0, 1, 1],
			[1, 0, 1],
			[1, 1, 0],
		],
		def: {
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
		},
	},
	swap: {
		table: [
			[0, 0, 0, 0],
			[0, 1, 1, 0],
			[1, 0, 0, 1],
			[1, 1, 1, 1],
		],
		def: {
			io: [2, 2],
			chips: {},
			edges: [
				['IN', 0, 'OUT', 1],
				['IN', 1, 'OUT', 0],
			],
		},
	},
	or: {
		table: [
			[0, 0, 0],
			[0, 1, 1],
			[1, 0, 1],
			[1, 1, 1],
		],
		def: {
			io: [2, 1],
			chips: {
				n1: 'NOT',
				n2: 'NOT',
				nand: 'NAND',
			},
			edges: [
				['IN', 0, 'n1', 0],
				['IN', 1, 'n2', 0],
				['n1', 0, 'nand', 0],
				['n2', 0, 'nand', 1],
				['nand', 0, 'OUT', 0],
			],
		},
	},
};

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

			const chip = new ChipDeserializer().deserializeChip(definitionObj);
			expect(chip.inputs.length).toBe(resIn);
			expect(chip.outputs.length).toBe(resOut);
		});
	});

	describe('deserializes custom "swap" circuit', () => {
		test.each(chipExamples.swap.table)(
			'[%s %s] -> [%s %s]',
			(in1, in2, out1, out2) => {
				const deserializer = new ChipDeserializer();
				const chip = deserializer.deserializeChip(chipExamples.swap.def);

				chip.setInput(0, Boolean(in1));
				chip.setInput(1, Boolean(in2));
				expect(chip.outputs[0].state).toBe(Boolean(out1));
				expect(chip.outputs[1].state).toBe(Boolean(out2));
			});
	});

	describe('deserializes NAND circuit', () => {
		test.each(chipExamples.nand.table)(
			'%d ^& %d -> %d',
			(in1, in2, res) => {
				const deserializer = new ChipDeserializer();
				const nand = deserializer.deserializeChip(chipExamples.nand.def);

				nand.setInput(0, Boolean(in1));
				nand.setInput(1, Boolean(in2));
				const output = nand.outputs[0].state;

				expect(output).toBe(Boolean(res));
			});
	});

	describe('handles chip definitions containing custom chips', () => {
		test.each(chipExamples.or.table)(
			'%d || %d -> %d',
			(in1, in2, res) => {
				const deserializer = new ChipDeserializer();
				const {OR} = deserializer.deserializeChips({
					OR: chipExamples.or.def,
					NAND: chipExamples.nand.def,
				});

				const or = new OR();

				or.setInput(0, Boolean(in1));
				or.setInput(1, Boolean(in2));
				const output = or.outputs[0].state;

				expect(output).toBe(Boolean(res));
			},
		);
	});
});
