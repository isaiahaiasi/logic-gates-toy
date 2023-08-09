import {type CircuitDescription} from './ComplexChipFactory';

type TruthTable = number[][];

interface ComplexGateInfo {
	table: TruthTable;
	def: CircuitDescription;
}

/** These are chips that I did not define Gate subclasses for,
 * and so do use other chips, but can be expressed through Truth Tables.
 */
export const complexGates = {
	nand: {
		table: [
			[0, 0, 1],
			[0, 1, 1],
			[1, 0, 1],
			[1, 1, 0],
		],
		def: {
			typeId: 'NAND',
			inputCount: 2,
			outputCount: 1,
			chips: {
				a: 'AND',
				n: 'NOT',
			},
			wires: [
				['IN', 0, 'a', 0],
				['IN', 1, 'a', 1],
				['a', 0, 'n', 0],
				['n', 0, 'OUT', 0],
			],
		},
	},
	swap: {
		table: [
			[0, 0, 0, 0],
			[0, 1, 1, 0],
			[1, 0, 0, 1],
			[1, 1, 1, 1],
		],
		def: {
			typeId: 'SWAP',
			inputCount: 2,
			outputCount: 2,
			chips: {},
			wires: [
				['IN', 0, 'OUT', 1],
				['IN', 1, 'OUT', 0],
			],
		},
	},
	nor: {
		table: [
			[0, 0, 1],
			[0, 1, 0],
			[1, 0, 0],
			[1, 1, 0],
		],
		def: {
			typeId: 'NOR',
			inputCount: 2,
			outputCount: 1,
			chips: {
				'nor-or': 'OR',
				'nor-not': 'NOT',
			},
			wires: [
				['IN', 0, 'nor-or', 0],
				['IN', 1, 'nor-or', 1],
				['nor-or', 0, 'nor-not', 0],
				['nor-not', 0, 'OUT', 0],
			],
		},
	},
	xor: {
		table: [
			[0, 0, 0],
			[0, 1, 1],
			[1, 0, 1],
			[1, 1, 0],
		],
		def: {
			typeId: 'XOR',
			inputCount: 2,
			outputCount: 1,
			chips: {
				or: 'OR',
				nand: 'NAND',
				and: 'AND',
			},
			wires: [
				['IN', 0, 'or', 0],
				['IN', 1, 'or', 1],
				['IN', 0, 'nand', 0],
				['IN', 1, 'nand', 1],
				['or', 0, 'and', 0],
				['nand', 0, 'and', 1],
				['and', 0, 'OUT', 0],
			],
		},
	},
	or3: {
		table: [
			[0, 0, 0, 0],
			[0, 0, 1, 1],
			[0, 1, 0, 1],
			[0, 1, 1, 1],
			[1, 0, 0, 1],
			[1, 0, 1, 1],
			[1, 1, 0, 1],
			[1, 1, 1, 1],
		],
		def: {
			typeId: 'OR3',
			inputCount: 3,
			outputCount: 1,
			chips: {
				or1: 'OR',
				or2: 'OR',
			},
			wires: [
				['IN', 0, 'or1', 0],
				['IN', 1, 'or1', 1],
				['or1', 0, 'or2', 0],
				['IN', 2, 'or2', 1],
				['or2', 0, 'OUT', 0],
			],
		},
	},
	adder: {
		table: [
			[0, 0, 0, 0, 0],
			[0, 0, 1, 1, 0],
			[0, 1, 0, 1, 0],
			[1, 0, 0, 1, 0],
			[0, 1, 1, 0, 1],
			[1, 0, 1, 0, 1],
			[1, 1, 0, 0, 1],
			[1, 1, 1, 1, 1],
		],
		def: {
			typeId: 'ADDER',
			inputCount: 3, // Input 1, Input 2, Carry
			outputCount: 2, // Sum, Carry
			chips: {
				and1: 'AND',
				and2: 'AND',
				xor1: 'XOR',
				xor2: 'XOR',
				or1: 'OR',
			},
			wires: [
				['IN', 0, 'xor1', 0],
				['IN', 1, 'xor1', 1],
				['IN', 0, 'and1', 0],
				['IN', 1, 'and1', 1],
				['IN', 2, 'xor2', 1],
				['IN', 2, 'and2', 1],
				['xor1', 0, 'xor2', 0],
				['xor1', 0, 'and2', 0],
				['and2', 0, 'or1', 0],
				['and1', 0, 'or1', 1],
				['xor2', 0, 'OUT', 0],
				['or1', 0, 'OUT', 1],
			],
		},
	},
} satisfies Record<string, ComplexGateInfo>;

/** Complex circuits that may contain stateful information that cannot be
 * easily expressed through a Truth Table.
 */
export const complexCircuits = {
	srLatch: {
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
	},
} satisfies Record<string, CircuitDescription>;
