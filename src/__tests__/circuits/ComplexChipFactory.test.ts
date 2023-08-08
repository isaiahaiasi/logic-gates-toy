/* eslint-disable @typescript-eslint/naming-convention */
import {describe, expect, test} from 'vitest';
import {ComplexChipFactory, type CircuitDescription} from '../../circuits/ComplexChipFactory';

type TruthTable = Array<Array<boolean | number>>;

interface ChipExample {
	table: TruthTable;
	def: CircuitDescription;
}

const chipExamples = {
	nand: {
		table: [
			[0, 0, 1],
			[0, 1, 1],
			[1, 0, 1],
			[1, 1, 0],
		],
		def: {
			typeId: 'NAND',
			inputCount: 2,
			outputCount: 1,
			chips: {
				a: 'AND',
				n: 'NOT',
			},
			wires: [
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
			typeId: 'SWAP',
			inputCount: 2,
			outputCount: 2,
			chips: {},
			wires: [
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
			typeId: 'OR',
			inputCount: 2,
			outputCount: 1,
			chips: {
				n1: 'NOT',
				n2: 'NOT',
				nand: 'NAND',
			},
			wires: [
				['IN', 0, 'n1', 0],
				['IN', 1, 'n2', 0],
				['n1', 0, 'nand', 0],
				['n2', 0, 'nand', 1],
				['nand', 0, 'OUT', 0],
			],
		},
	},
	nor: {
		table: [
			[0, 0, 1],
			[0, 1, 0],
			[1, 0, 0],
			[1, 1, 0],
		],
		def: {
			typeId: 'NOR',
			inputCount: 2,
			outputCount: 1,
			chips: {
				'nor-or': 'OR',
				'nor-not': 'NOT',
			},
			wires: [
				['IN', 0, 'nor-or', 0],
				['IN', 1, 'nor-or', 1],
				['nor-or', 0, 'nor-not', 0],
				['nor-not', 0, 'OUT', 0],
			],
		},
	},
	or3: {
		table: [
			[0, 0, 0, 0],
			[0, 0, 1, 1],
			[0, 1, 0, 1],
			[0, 1, 1, 1],
			[1, 0, 0, 1],
			[1, 0, 1, 1],
			[1, 1, 0, 1],
			[1, 1, 1, 1],
		],
		def: {
			typeId: 'OR3',
			inputCount: 3,
			outputCount: 1,
			chips: {
				or1: 'OR',
				or2: 'OR',
			},
			wires: [
				['IN', 0, 'or1', 0],
				['IN', 1, 'or1', 1],
				['or1', 0, 'or2', 0],
				['IN', 2, 'or2', 1],
				['or2', 0, 'OUT', 0],
			],
		},
	},
} satisfies Record<string, ChipExample>;

describe('Chip de-serialization', () => {
	test('throws on attempt to overwrite chip with new definition', () => {
		const chipFactory = new ComplexChipFactory();
		const overwrite = () => chipFactory.buildChip(chipExamples.swap.def);

		chipFactory.buildChip(chipExamples.swap.def);

		expect(overwrite).toThrow();
	});

	test('allows overwriting a chip with new definition, if flag passed', () => {
		const factory = new ComplexChipFactory();

		factory.buildChip(chipExamples.swap.def);

		expect(() => factory.buildChip(chipExamples.swap.def, true)).not.toThrow();
	});

	describe('deserializes with correct number of inputs/outputs', () => {
		const codes: Array<[number, number]> = [
			[0, 1],
			[3, 0],
			[30, 30],
		];

		test.each(codes)('%i/%i', (resIn, resOut) => {
			const definitionObj = {
				typeId: 'EMPTY',
				inputCount: resIn,
				outputCount: resOut,
				chips: {},
				wires: [],
			} satisfies CircuitDescription;

			const Chip = new ComplexChipFactory().buildChip(definitionObj);
			const chip = new Chip();
			expect(chip.inputCount).toBe(resIn);
			expect(chip.outputCount).toBe(resOut);
		});
	});

	describe('deserializes custom "swap" circuit', () => {
		test.each(chipExamples.swap.table)(
			'[%s %s] -> [%s %s]',
			(in1, in2, out1, out2) => {
				const factory = new ComplexChipFactory();
				const Swap = factory.buildChip(chipExamples.swap.def);
				const swap = new Swap();

				swap.setInput(0, Boolean(in1));
				swap.setInput(1, Boolean(in2));
				expect(swap.outputState[0]).toBe(Boolean(out1));
				expect(swap.outputState[1]).toBe(Boolean(out2));
			});
	});

	describe('deserializes NAND circuit', () => {
		test.each(chipExamples.nand.table)(
			'%d ^& %d -> %d',
			(in1, in2, res) => {
				const factory = new ComplexChipFactory();
				const Nand = factory.buildChip(chipExamples.nand.def);
				const nand = new Nand();

				nand.setInput(0, Boolean(in1));
				nand.setInput(1, Boolean(in2));
				const output = nand.outputState[0];

				expect(output).toBe(Boolean(res));
			});
	});

	describe('handles chip definitions containing custom chips', () => {
		test.each(chipExamples.or.table)(
			'%d || %d -> %d',
			(in1, in2, res) => {
				const factory = new ComplexChipFactory();
				factory.buildChip(chipExamples.nand.def);
				const OR = factory.buildChip(chipExamples.or.def, true);
				const or = new OR();

				or.setInput(0, Boolean(in1));
				or.setInput(1, Boolean(in2));
				const [output] = or.outputState;

				expect(output).toBe(Boolean(res));
			},
		);
	});

	describe('handles chip definitions with multiple-deep nestings of custom chips', () => {
		test.each(chipExamples.or3.table)(
			'%d || %d || %d -> %d',
			(in1, in2, in3, res) => {
				const factory = new ComplexChipFactory();
				factory.buildChip(chipExamples.nand.def);
				factory.buildChip(chipExamples.or.def, true);
				const OR3 = factory.buildChip(chipExamples.or3.def);
				const or3 = new OR3();

				or3.setInput(0, Boolean(in1));
				or3.setInput(1, Boolean(in2));
				or3.setInput(2, Boolean(in3));
				const [output] = or3.outputState;

				expect(output).toBe(Boolean(res));
			},
		);
	});

	// Don't see why this is necessary...
	describe('handles NOR', () => {
		test.each(chipExamples.nor.table)(
			'%d ^|| %d -> %d',
			(in1, in2, res) => {
				const factory = new ComplexChipFactory();
				factory.buildChip(chipExamples.nand.def);
				factory.buildChip(chipExamples.or.def, true);
				const NOR = factory.buildChip(chipExamples.nor.def);

				const nor = new NOR();

				nor.setInput(0, Boolean(in1));
				nor.setInput(1, Boolean(in2));
				const [output] = nor.outputState;

				expect(output).toBe(Boolean(res));
			},
		);
	});

	test('SR-Latch (no NOR)', () => {
		// OR-NOT-AND Latch
		const latchDef = {
			typeId: 'SR-LATCH',
			inputCount: 2,
			outputCount: 1,
			chips: {
				o: 'OR',
				n: 'NOT',
				a: 'AND',
			},
			wires: [
				['IN', 0, 'o', 1],
				['IN', 1, 'n', 0],
				['o', 0, 'a', 0],
				['n', 0, 'a', 1],
				['a', 0, 'o', 0],
				['a', 0, 'OUT', 0],
			],
		} satisfies CircuitDescription;

		const factory = new ComplexChipFactory();
		const Latch = factory.buildChip(latchDef);
		const latch = new Latch();

		// Setting "SET" (input 0) true outputs true
		latch.setInput(0, true);
		expect(latch.outputState).toEqual([true]);

		// Latch remembers SET even when SET input is turned off
		latch.setInput(0, false);
		expect(latch.outputState).toEqual([true]);

		// "Pressing" "RESET" (input 1) resets output to false
		latch.setInput(1, true);
		latch.setInput(1, false);
		expect(latch.outputState).toEqual([false]);
	});

	test('SR-Latch (NOR)', () => {
		const latchDef = {
			typeId: 'SR_LATCH',
			inputCount: 2,
			outputCount: 2,
			chips: {
				n1: 'NOR',
				n2: 'NOR',
			},
			wires: [
				['IN', 0, 'n1', 0],
				['n1', 0, 'OUT', 0],
				['n1', 0, 'n2', 0],
				['n2', 0, 'OUT', 1],
				['n2', 0, 'n1', 1],
				['IN', 1, 'n2', 1],
			],
		} satisfies CircuitDescription;

		const factory = new ComplexChipFactory();

		factory.buildChip(chipExamples.nand.def);
		factory.buildChip(chipExamples.nor.def);
		const Latch = factory.buildChip(latchDef);

		const latch = new Latch();

		// The "RESET" input must be triggered to initialize this chip
		// Otherwise, it's starts in a "garbage" state.
		latch.setInput(1, true);
		latch.setInput(1, false);

		// Setting "SET" (input 0) true outputs true
		latch.setInput(0, true);
		expect(latch.outputState[0]).toBe(false);
		expect(latch.outputState[1]).toBe(true);

		// Latch remembers SET even when SET input is turned off
		latch.setInput(0, false);
		expect(latch.outputState[0]).toBe(false);
		expect(latch.outputState[1]).toBe(true);

		// "Pressing" "RESET" (input 1) resets output to false
		latch.setInput(1, true);
		latch.setInput(1, false);
		expect(latch.outputState[0]).toBe(true);
		expect(latch.outputState[1]).toBe(false);
	});
});
