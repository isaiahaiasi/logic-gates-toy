/* eslint-disable @typescript-eslint/naming-convention */
import {type CircuitDescription} from '../../circuits/CircuitDescription';
import {complexGates} from '../../circuits/complexChipDefinitions';
import {ComplexChipFactory} from '../../circuits/ComplexChipFactory';

function getCompleteGateFactory() {
	const factory = new ComplexChipFactory();
	Object.values(complexGates).forEach(({def}) => {
		factory.buildChip(def);
	});
	return factory;
}

describe('complex gates', () => {
	for (const [name, gateInfo] of Object.entries(complexGates)) {
		// eslint-disable-next-line @typescript-eslint/no-loop-func
		describe(`${name} works`, () => {
			const factory = getCompleteGateFactory();
			const {table, def} = gateInfo;
			const Gate = factory.buildChip(def, true);

			// For each row of the truth table:
			// - create a new gate.
			// - set the inputs.
			// - test the outputs.
			for (let i = 0; i < table.length; ++i) {
				const row = table[i];
				// eslint-disable-next-line @typescript-eslint/no-loop-func
				test(`Row ${i}: ${row.toString()}`, () => {
					const gate = new Gate();

					// Set inputs
					for (let j = 0; j < def.inputCount; ++j) {
						gate.setInput(j, Boolean(row[j]));
					}

					const expectedOutput = row.slice(def.inputCount).map(n => Boolean(n));

					expect(gate.outputState).toEqual(expectedOutput);
				});
			}
		});
	}
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

	factory.buildChip(complexGates.nand.def);
	factory.buildChip(complexGates.nor.def);
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
