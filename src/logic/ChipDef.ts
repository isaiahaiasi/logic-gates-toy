
/* eslint-disable @typescript-eslint/naming-convention */
interface Chip {
	/** TypeId MUST be unique.
	* Used to identify the chip type/template; eg, NAND, 8BIT-ADDER, etc.
	*
	* Different from the *instance* name (eg, "nand0" & "nand1")
	*/
	typeId: string;

	/** Number of [x, y] grid points this chip should take up when displayed in a circuit.
	 *
	 * `y` must be at least `max(inputs.length, outputs.length)`
	*/
	externalChipSize: [number, number];
}

interface Gate extends Chip {
	inputCount: number;
}

interface ComplexChip extends Chip {
	/** The resolution of the grid on which chips & wires can be positioned
	 * when displaying chip as a Circuit.
	*/
	gridSize: [number, number];

	/** `height` is the vertical position on the side of the grid.
	 *
	 * (must be less than gridSize[1])
	 */
	inputs: Array<{name: string; height: number}>;
	outputs: Array<{name: string; height: number}>;

	chips: Record<string, {
		/** `[x, y]` must be less than `gridSize[x, y]` */
		pos: [number, number];

		type: string;
	}>;
	edges: Record<string, Array<{
		// `path` allows the option to draw the "wire" in a sensible way,
		// rather than drawing a straight line between pins.
		path?: Array<[number, number]>;

		chip: string;
		pin: number;
	}>>;
}

const andGate: Gate = {
	typeId: 'AND',
	externalChipSize: [3, 2],
	inputCount: 2,
};

const notGate: Gate = {
	typeId: 'NOT',
	externalChipSize: [2, 2],
	inputCount: 1,
};

const nand: ComplexChip = {
	typeId: 'NAND',
	externalChipSize: [2, 1],
	gridSize: [20, 15],
	inputs: [
		{name: 'IN A', height: 6},
		{name: 'IN B', height: 8},
	],
	outputs: [
		{name: 'OUT', height: 1},
	],
	chips: {
		and0: {type: 'AND', pos: [6, 7]},
		not0: {type: 'NOT', pos: [12, 7]},
	},
	edges: {
		'IN A': [{chip: 'and0', pin: 0}],
		'IN B': [{chip: 'and0', pin: 1}],
		and0: [{chip: 'not0', pin: 0}],
		not0: [{
			chip: 'OUT', pin: 0, path: [[15, 7], [15, 1]],
		}],
	},
};

const or: ComplexChip = {
	typeId: 'OR',
	externalChipSize: [2, 1],
	gridSize: [10, 5],
	inputs: [
		{name: 'IN A', height: 1},
		{name: 'IN B', height: 3},
	],
	outputs: [
		{name: 'OUT', height: 2},
	],
	chips: {
		not0: {type: 'NOT', pos: [3, 1]},
		not1: {type: 'NOT', pos: [3, 3]},
		nand0: {type: 'NAND', pos: [6, 3]},
	},
	edges: {
		'IN A': [{chip: 'not0', pin: 0}],
		'IN B': [{chip: 'not1', pin: 0}],
		not0: [{chip: 'nand0', pin: 0}],
		not1: [{chip: 'nand0', pin: 1}],
		nand0: [{chip: 'OUT', pin: 0}],
	},
};

export const gates = {
	AND: andGate,
	NOT: notGate,
};

export const presetCustomChips = {
	NAND: nand,
	OR: or,
	// NOR: nor,
	// OR3: or3,
} satisfies Record<string, ComplexChip>;

export function getGateOutput(gate: Gate, inputs: boolean[]): boolean {
	if (inputs.length !== gate.inputCount) {
		throw new Error(`Wrong number of inputs given. Received ${inputs.length}, expected ${gate.inputCount}`);
	}

	switch (gate.typeId) {
		case 'AND':
			return inputs[0] && inputs[1];
		case 'NOT':
			return !inputs[0];
		default:
			throw new Error(`Unhandled Gate type ${gate.typeId}`);
	}
}
