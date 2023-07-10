/* eslint-disable @typescript-eslint/naming-convention */
import {describe, expect, test} from 'vitest';
import {type ChipDefinitionObject, ChipDeserializer} from '../../logic/chipSerializer';

type TruthTable = Array<Array<boolean | number>>;

interface ChipExample {
	table: TruthTable;
	def: ChipDefinitionObject;
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
	nor: {
		table: [
			[0, 0, 1],
			[0, 1, 0],
			[1, 0, 0],
			[1, 1, 0],
		],
		def: {
			io: [2, 1],
			chips: {
				'nor-or': 'OR',
				'nor-not': 'NOT',
			},
			edges: [
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
			io: [3, 1],
			chips: {
				or1: 'OR',
				or2: 'OR',
			},
			edges: [
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
	test('overwrites chip with new definition', () => {
		const deserializer = new ChipDeserializer();
		const origConstructor = deserializer.deserializeChip('SWAP', chipExamples.nand.def);
		const newConstructor = deserializer.deserializeChip('SWAP', chipExamples.swap.def);

		const finalConstructor = deserializer.chips.SWAP;

		expect(finalConstructor).toBe(newConstructor);
		expect(finalConstructor).not.toBe(origConstructor);
	});

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

			const Chip = new ChipDeserializer().deserializeChip('EMPTY', definitionObj);
			const chip = new Chip();
			expect(chip.inputs.length).toBe(resIn);
			expect(chip.outputs.length).toBe(resOut);
		});
	});

	describe('deserializes custom "swap" circuit', () => {
		test.each(chipExamples.swap.table)(
			'[%s %s] -> [%s %s]',
			(in1, in2, out1, out2) => {
				const deserializer = new ChipDeserializer();
				const Swap = deserializer.deserializeChip('SWAP', chipExamples.swap.def);
				const swap = new Swap();

				swap.setInput(0, Boolean(in1));
				swap.setInput(1, Boolean(in2));
				expect(swap.outputs[0].state).toBe(Boolean(out1));
				expect(swap.outputs[1].state).toBe(Boolean(out2));
			});
	});

	describe('deserializes NAND circuit', () => {
		test.each(chipExamples.nand.table)(
			'%d ^& %d -> %d',
			(in1, in2, res) => {
				const deserializer = new ChipDeserializer();
				const Nand = deserializer.deserializeChip('NAND', chipExamples.nand.def);
				const nand = new Nand();

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

	describe('handles chip definitions with multiple-deep nestings of custom chips', () => {
		test.each(chipExamples.or3.table)(
			'%d || %d || %d -> %d',
			(in1, in2, in3, res) => {
				const deserializer = new ChipDeserializer();
				const {OR3} = deserializer.deserializeChips({
					OR3: chipExamples.or3.def,
					OR: chipExamples.or.def,
					NAND: chipExamples.nand.def,
				});

				const or3 = new OR3();

				or3.setInput(0, Boolean(in1));
				or3.setInput(1, Boolean(in2));
				or3.setInput(2, Boolean(in3));
				const output = or3.outputs[0].state;

				expect(output).toBe(Boolean(res));
			},
		);
	});
});

describe('handles NOR', () => {
	test.each(chipExamples.nor.table)(
		'%d ^|| %d -> %d',
		(in1, in2, res) => {
			const deserializer = new ChipDeserializer();
			const {NOR} = deserializer.deserializeChips({
				NOR: chipExamples.nor.def,
				OR: chipExamples.or.def,
				NAND: chipExamples.nand.def,
			});

			const nor = new NOR();

			nor.setInput(0, Boolean(in1));
			nor.setInput(1, Boolean(in2));
			const output = nor.outputs[0].state;

			expect(output).toBe(Boolean(res));
		},
	);
});

test('SR-Latch (no NOR)', () => {
	// OR-NOT-AND Latch
	const latchDef = {
		io: [2, 1],
		chips: {
			o: 'OR',
			n: 'NOT',
			a: 'AND',
		},
		edges: [
			['IN', 0, 'o', 1],
			['IN', 1, 'n', 0],
			['o', 0, 'a', 0],
			['n', 0, 'a', 1],
			['a', 0, 'o', 0],
			['a', 0, 'OUT', 0],
		],
	} satisfies ChipDefinitionObject;

	const deserializer = new ChipDeserializer();

	const chips = deserializer.deserializeChips({
		NAND: chipExamples.nand.def,
		OR: chipExamples.or.def,
		NOR: chipExamples.nor.def,
		LATCH: latchDef,
	});

	const latch = new chips.LATCH();

	// Setting "SET" (input 0) true outputs true
	latch.setInput(0, true);
	expect(latch.outputs[0].state).toBe(true);

	// Latch remembers SET even when SET input is turned off
	latch.setInput(0, false);
	expect(latch.outputs[0].state).toBe(true);

	// "Pressing" "RESET" (input 1) resets output to false
	latch.setInput(1, true);
	latch.setInput(1, false);
	expect(latch.outputs[0].state).toBe(false);
});

// TODO: WHY DOES THE OTHER LATCH WORK BUT NOT THIS ONE???
test('SR-Latch (NOR)', () => {
	// Traditional latch
	const latchDef = {
		io: [2, 2],
		chips: {
			n1: 'NOR',
			n2: 'NOR',
		},
		edges: [
			['IN', 0, 'n1', 0],
			['n1', 0, 'OUT', 0],
			['n1', 0, 'n2', 0],
			['n2', 0, 'OUT', 1],
			['n2', 0, 'n1', 1],
			['IN', 1, 'n2', 1],
		],
	} satisfies ChipDefinitionObject;

	const deserializer = new ChipDeserializer();

	const chips = deserializer.deserializeChips({
		NAND: chipExamples.nand.def,
		OR: chipExamples.or.def,
		NOR: chipExamples.nor.def,
		LATCH: latchDef,
	});

	const latch = new chips.LATCH();

	// TODO: For some reason, the RESET input must be triggered to initialize this chip
	// Otherwise, it's starts in an invalid state with both outputs FALSE
	// (the outputs are Q & bar-Q)
	latch.setInput(1, true);
	latch.setInput(1, false);

	// Setting "SET" (input 0) true outputs true
	latch.setInput(0, true);
	expect(latch.outputs[0].state).toBe(false);
	expect(latch.outputs[1].state).toBe(true);

	// Latch remembers SET even when SET input is turned off
	latch.setInput(0, false);
	expect(latch.outputs[0].state).toBe(false);
	expect(latch.outputs[1].state).toBe(true);

	// "Pressing" "RESET" (input 1) resets output to false
	latch.setInput(1, true);
	latch.setInput(1, false);
	expect(latch.outputs[0].state).toBe(true);
	expect(latch.outputs[1].state).toBe(false);
});
