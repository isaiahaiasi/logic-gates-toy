import {type Chip} from './Chip';

/** A serializable description of a "Circuit",
 * which can be used to construct a ComplexChip. */
export interface CircuitDescription {
	typeId: string;
	inputCount: number;
	outputCount: number;
	chips: Record<string, string>;
	wires: Array<[string, number, string, number]>;
}

/** A "nullary" function takes no arguments. */
export type NullaryChipConstructor = new () => Chip;
