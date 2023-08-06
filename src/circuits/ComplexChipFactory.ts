import {type GateName} from './Gate';

/** A serializable description of a "Circuit",
 * which can be used to construct a ComplexChip. */
export interface CircuitDescription {
	typeId: string;
	inputCount: number;
	outputCount: number;
	chips: Record<string, CircuitDescription | GateName>;
	wires: Record<string, [string, number]>;
}
