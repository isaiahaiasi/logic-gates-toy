// I'm just not really sure what they should be...

import {describe, expect, test, vi} from 'vitest';
import {Gate} from '../../logic/Gate';

describe('Generic gate behavior', () => {
	describe('gate is initialized with the correct inputs and outputs', () => {
		const ioCounts = [
			[0, 0],
			[1, 1],
			[2, 5],
			[4, 2],
			[1023, 1029],
		];

		const testRow = (inCount: number, outCount: number) => {
			const gate = new Gate(inCount, outCount);
			expect(gate.inputs.length).toBe(inCount);
			expect(gate.outputs.length).toBe(outCount);
		};

		test.each(ioCounts)('in#: %i, out#: %i', testRow);
	});

	test('setInput() sets the input state', () => {
		const gate = new Gate(1, 0);

		expect(gate.inputs[0]).toBe(false); // Default off

		gate.setInput(0, true);
		expect(gate.inputs[0]).toBe(true);

		gate.setInput(0, false);
		expect(gate.inputs[0]).toBe(false);
	});

	test('setInput() calls the process() method', () => {
		// The process() method is customized by child classes,
		// And this class promises to call process whenever the inputs change
		const gate = new Gate(1, 1);
		const processSpy = vi.spyOn(gate, 'process');
		gate.setInput(0, true);
		expect(processSpy).toHaveBeenCalled();
	});

	test('setOutput() sets the output state', () => {
		const gate = new Gate(0, 1);
		expect(gate.outputs[0].state).toBe(false);
		gate.setOutput(0, true);
		expect(gate.outputs[0].state).toBe(true);
	});

	test('setOutput() calls setInput() for any listeners on that pin', () => {
		const sender = new Gate(0, 1);
		const listener = new Gate(1, 0);
		const outPin = 0;
		const inPin = 0;
		const inputSpy = vi.spyOn(listener, 'setInput');

		sender.outputs[outPin].listeners.push({gate: listener, pin: inPin});

		sender.setOutput(outPin, true);

		expect(inputSpy).toHaveBeenCalledWith(inPin, true);
	});

	test('addListener() adds listener to given IO pin', () => {
		const sender = new Gate(0, 4);
		const listener1 = {gate: new Gate(1, 0), pin: 0};
		const listener2 = {gate: new Gate(3, 1), pin: 2};

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
