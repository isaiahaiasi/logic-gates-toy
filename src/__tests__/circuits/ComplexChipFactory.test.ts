/* eslint-disable @typescript-eslint/naming-convention */
import {describe, expect, test} from 'vitest';
import {ComplexChipFactory, type CircuitDescription} from '../../circuits/ComplexChipFactory';

const swapDef: CircuitDescription = {
	typeId: 'SWAP',
	inputCount: 2,
	outputCount: 2,
	chips: {},
	wires: [
		['IN', 0, 'OUT', 1],
		['IN', 1, 'OUT', 0],
	],
};

describe('Chip de-serialization', () => {
	test('throws on attempt to overwrite chip with new definition', () => {
		const chipFactory = new ComplexChipFactory();
		const overwrite = () => chipFactory.buildChip(swapDef);

		chipFactory.buildChip(swapDef);

		expect(overwrite).toThrow();
	});

	test('allows overwriting a chip with new definition, if flag passed', () => {
		const factory = new ComplexChipFactory();

		factory.buildChip(swapDef);

		expect(() => factory.buildChip(swapDef, true)).not.toThrow();
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
});
