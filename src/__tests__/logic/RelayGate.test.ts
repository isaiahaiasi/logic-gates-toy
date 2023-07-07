import {describe, expect, test} from 'vitest';
import {RelayGate} from '../../logic/RelayGate';

describe('Relay Gate conforms to idenity behavior', () => {
	// Tests single input->output states for difference relay sizes
	test.each([1, 2, 3])('Relay size: %i', n => {
		const relay = new RelayGate(n);
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				relay.setInput(j, false);
			}

			relay.setInput(i, true);

			for (let j = 0; j < n; j++) {
				const result = j === i;
				expect(relay.outputs[j].state).toBe(result);
			}
		}
	});
});
