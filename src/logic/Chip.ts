export interface Chip {
	inputs: boolean[];
	outputs: OutputInfo[];
	addListener(outputPin: number, listener: ChipPin): void;
	setInput(inputPin: number, active: boolean): void;
}

export interface OutputInfo {
	listeners: ChipPin[];
	state: boolean;
}

export interface ChipPin {
	chip: Chip;
	pin: number; // Chip I/O index
}
