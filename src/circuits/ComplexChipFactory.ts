import {ComplexChip} from '../circuits/ComplexChip';
import {type RelayGate, type GateName} from './Gate';

/** A serializable description of a "Circuit",
 * which can be used to construct a ComplexChip. */
export interface CircuitDescription {
	typeId: string;
	inputCount: number;
	outputCount: number;
	chips: Record<string, CircuitDescription | GateName>;
	wires: Record<string, [string, number]>;
}

function buildComplexChipInternals(
	_description: CircuitDescription,
	_input: RelayGate,
	_output: RelayGate,
) {
	// TODO
}

export function complexChipFactory(def: CircuitDescription) {
	return class PureComplexChip extends ComplexChip {
		constructor() {
			super(def.inputCount, def.outputCount);
		}

		buildCircuit(inRelay: RelayGate, outRelay: RelayGate) {
			buildComplexChipInternals(def, inRelay, outRelay);
		}
	};
}
