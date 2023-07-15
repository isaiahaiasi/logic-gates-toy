import type * as zustand from 'zustand';
import {act} from '@testing-library/react';
import {vi, afterEach} from 'vitest';

const {create: actualCreate} = await vi.importActual<typeof zustand>(
	'zustand',
);

// A variable to hold reset functions for all stores declared in the app
export const storeResetFns = new Set<() => void>();

// When creating a store, we get its initial state, create a reset function and add it in the set
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const create = (<T extends unknown>() => (stateCreator: zustand.StateCreator<T>) => {
	const store = actualCreate(stateCreator);
	const initialState = store.getState();
	storeResetFns.add(() => {
		store.setState(initialState, true);
	});
	return store;
}) as typeof zustand.create;

// Reset all stores after each test run
afterEach(() => {
	act(() => {
		storeResetFns.forEach(resetFn => {
			resetFn();
		});
	});
});
