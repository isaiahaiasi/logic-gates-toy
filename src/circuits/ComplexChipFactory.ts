/* eslint-disable @typescript-eslint/naming-convention */
import {ComplexChip} from '../circuits/ComplexChip';
import {type CircuitDescription, type NullaryChipConstructor} from './CircuitDescription';
import {gateConstructors} from './Gate';

export class ComplexChipFactory {
	chipConstructors: Record<string, NullaryChipConstructor>;

	constructor() {
		this.chipConstructors = {...gateConstructors};
	}

	buildChip(def: CircuitDescription, overwrite = false) {
		// Do not allow chips to be re-defined without flag.
		if (!overwrite && def.typeId in this.chipConstructors) {
			throw new Error(`Chip ${def.typeId} already defined!`);
		}

		const chipLib = this.chipConstructors;

		const NewComplexChip = class PureComplexChip extends ComplexChip {
			constructor() {
				super(def, chipLib);
			}
		};

		this.chipConstructors[def.typeId] = NewComplexChip;

		return NewComplexChip;
	}
}
