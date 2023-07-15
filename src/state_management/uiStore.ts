import {create} from 'zustand';
import {type Vec2, type Node} from '../flowchart/graph';

interface NodePlacementInfo {
	spawnPosition: Vec2;
}

export interface NodeTemplate {
	templateFn: (info: NodePlacementInfo) => Node;
	label: string;
}

interface UiState {
	/** Some info (ie Position) can only be known once the Node is actually "placed."
	 * So when a "node" is picked up, it's actually a factory function that can be
	 * called at "placement"-time.
	 */
	heldNodeTemplate?: NodeTemplate;
}

interface UiActions {
	pickUpNodeTemplate: (template: NodeTemplate) => void;
	dropNodeTemplate: () => void;
}

export const useUiStore = create<UiState & UiActions>(set => ({
	heldNodeTemplate: undefined,
	pickUpNodeTemplate(template) {
		set(_ => ({heldNodeTemplate: template}));
	},
	dropNodeTemplate() {
		set(_ => ({heldNodeTemplate: undefined}));
	},
}));
