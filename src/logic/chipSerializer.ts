
/* eslint-disable @typescript-eslint/naming-convention */
import {AndGate} from './AndGate';
import {type Chip} from './Chip';
import {ComplexChip} from './ComplexChip';
import {NotGate} from './NotGate';
import {type RelayGate} from './RelayGate';

const gateLib = {
	AND: AndGate,
	NOT: NotGate,
};

export interface ChipDefinitionObject {
	io: [number, number];
	chips: Record<string, keyof typeof gateLib>;
	edges: Array<[string, number, string, number]>;
}

// TODO: Enable chip definitions to contain custom chips
// - Given a list of chip definitions which reference each other,
//   sort the definitions topologically based on their dependencies
//   (eg, ChipB references ChipA, so ChipA must be deserialized first)
// - Dynamically extend gateLib to include custom chips as they are defined
export function deserializeChip(
	def: ChipDefinitionObject,
) {
	return new ComplexChip(
		def.io[0],
		def.io[1],
		(_in, _out) => {
			chipGenerator(def, _in, _out);
		},
	);
}

function chipGenerator(
	def: ChipDefinitionObject,
	IN: RelayGate,
	OUT: RelayGate): void {
	const chips: Record<string, Chip> = {
		IN,
		OUT,
		...Object.fromEntries(Object.keys(def.chips)
			.map(id => {
				const ChipConstructor = gateLib[def.chips[id]];
				return [id, new ChipConstructor()];
			})),
	};

	def.edges.forEach(([inId, inPin, outId, outPin]) => {
		if (!chips[inId]) {
			throw new Error(`Could not find chip ${inId}`);
		}

		if (!chips[outId]) {
			throw new Error(`Could not find chip ${outId}`);
		}

		const inChip = chips[inId];
		const outChip = chips[outId];

		inChip.addListener(inPin, {chip: outChip, pin: outPin});
	});
}
