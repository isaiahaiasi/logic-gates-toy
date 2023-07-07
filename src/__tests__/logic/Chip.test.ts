// I'm just not really sure what they should be...

import {describe, expect, test, vi} from 'vitest';
import AndChip from '../../logic/AndChip';
import NotChip from '../../logic/NotChip';
import Chip from '../../logic/Chip';

describe('Generic chip behavior', () => {
	describe('chip is initialized with the correct inputs and outputs', () => {
		const ioCounts = [
			[0, 0],
			[1, 1],
			[2, 5],
			[4, 2],
			[1023, 1029],
		];

		const testRow = (inCount: number, outCount: number) => {
			const chip = new Chip(inCount, outCount);
			expect(chip.inputs.length).toBe(inCount);
			expect(chip.outputs.length).toBe(outCount);
		};

		test.each(ioCounts)('in#: %i, out#: %i', testRow);
	});

	test('setInput() sets the input state', () => {
		const chip = new Chip(1, 0);

		expect(chip.inputs[0]).toBe(false); // Default off

		chip.setInput(0, true);
		expect(chip.inputs[0]).toBe(true);

		chip.setInput(0, false);
		expect(chip.inputs[0]).toBe(false);
	});

	test('setInput() calls the process() method', () => {
		// The process() method is customized by child classes,
		// And this class promises to call process whenever the inputs change
		const chip = new Chip(1, 1);
		const processSpy = vi.spyOn(chip, 'process');
		chip.setInput(0, true);
		expect(processSpy).toHaveBeenCalled();
	});

	test('setOutput() sets the output state', () => {
		const chip = new Chip(0, 1);
		expect(chip.outputs[0].state).toBe(false);
		chip.setOutput(0, true);
		expect(chip.outputs[0].state).toBe(true);
	});

	test('setOutput() calls setInput() for any listeners on that pin', () => {
		const sender = new Chip(0, 1);
		const listener = new Chip(1, 0);
		const outPin = 0;
		const inPin = 0;
		const inputSpy = vi.spyOn(listener, 'setInput');

		sender.outputs[outPin].listeners.push({chip: listener, pin: inPin});

		sender.setOutput(outPin, true);

		expect(inputSpy).toHaveBeenCalledWith(inPin, true);
	});

	test('addListener() adds listener to given IO pin', () => {
		const sender = new Chip(0, 4);
		const listener1 = {chip: new Chip(1, 0), pin: 0};
		const listener2 = {chip: new Chip(3, 1), pin: 2};

		expect(sender.outputs[0].listeners.length).toBe(0);
		expect(sender.outputs[1].listeners.length).toBe(0);
		expect(sender.outputs[2].listeners.length).toBe(0);
		expect(sender.outputs[3].listeners.length).toBe(0);

		sender.addListener(3, listener2);
		expect(sender.outputs[3].listeners.length).toBe(1);

		sender.addListener(0, listener1);
		expect(sender.outputs[0].listeners.length).toBe(1);

		sender.addListener(0, listener2);
		expect(sender.outputs[0].listeners.length).toBe(2);

		expect(sender.outputs[1].listeners.length).toBe(0);
		expect(sender.outputs[2].listeners.length).toBe(0);
	});
});

// !Temp
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
		const a = new AndChip();
		const n = new NotChip();
		const receiver = new Chip(1, 0);

		a.outputs[0].listeners.push({chip: n, pin: 0});
		n.outputs[0].listeners.push({chip: receiver, pin: 0});
		a.setInput(0, inputA);
		a.setInput(1, inputB);

		const output = receiver.inputs[0];
		expect(output).toBe(result);
	};

	test.each(truthTable)('%s	^& %s 	-> %s', testFn);
});
