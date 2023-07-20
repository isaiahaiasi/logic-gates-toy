import {create} from 'zustand';
import {type Vec2, type Node, type NodeId} from '../flowchart/graph';

interface NodePlacementInfo {
	spawnPosition: Vec2;
}

export interface NodeTemplate {
	templateFn: (info: NodePlacementInfo) => Node;
	label: string;
}

// NOTE: Not sure on "persistent" word choice.
/** Each exclusive option of the underlying UI State Machine */
type UiPersistentAction =
	'ADDING_NODE' |
	'ADDING_EDGE' |
	'REMOVING_EDGE' |
	'NONE';

interface UiState {
	/** The "state" of the UI, broadly:
	 * "are they holding a node?", "are they dragging an edge?", etc.
	 */
	currentAction: UiPersistentAction;

	/** If ADDING_NODE, the template for the node that is currently being added.
	 * This "template" is a node factory, rather than a node, because some info,
	 * (ie Position) can only be known once the Node is actually "placed."
	 * The factory function can then be called at "placement"-time.
	 */
	heldNodeTemplate?: NodeTemplate;

	/** If ADDING_EDGE, the ID for the partial edge's "source" node. */
	sourceNode?: NodeId;

	edgeSliceStart?: Vec2;
}

interface UiActions {
	pickUpNodeTemplate: (template: NodeTemplate) => void;
	dropNodeTemplate: () => void;
	pickUpEdge: (sourceId: NodeId) => void;
	dropEdge: () => void;
	sliceEdge: (pos: Vec2) => void;
}

// TODO: Write tests that guarantee invalid state is impossible
// - heldNodeTemplate must be set **IFF** currentAction ADDING_NODE
// - sourceNode must be set **IFF** currentAction ADDING_EDGE
// - edgeSliceStart must be set **IFF** currentAction REMOVING_EDGE
// - (that "and only if" means I need to test non-obvious paths thru State Machine graph)
export const useUiStore = create<UiState & UiActions>()(set => ({
	currentAction: 'NONE',
	heldNodeTemplate: undefined,
	sourceNode: undefined,
	edgeSliceStart: undefined,
	pickUpNodeTemplate(template) {
		set(_ => ({
			currentAction: 'ADDING_NODE',
			heldNodeTemplate: template,
			sourceNode: undefined,
		}));
	},
	dropNodeTemplate() {
		set(_ => ({
			currentAction: 'NONE',
			heldNodeTemplate: undefined,
		}));
	},
	pickUpEdge(sourceId) {
		set(_ => ({
			currentAction: 'ADDING_EDGE',
			sourceNode: sourceId,
			heldNodeTemplate: undefined,
			edgeSliceStart: undefined,
		}));
	},
	dropEdge() {
		set(_ => ({
			currentAction: 'NONE',
			sourceNode: undefined,
		}));
	},
	// NOTE: Not sure it actually makes sense to handle these two states under one Action.
	sliceEdge(pos: Vec2) {
		set(state => {
			if (state.currentAction === 'NONE') {
				// Begin slice
				return {
					currentAction: 'REMOVING_EDGE',
					edgeSliceStart: pos,
				};
			}

			if (state.currentAction === 'REMOVING_EDGE') {
				// Finish slice
				return {
					currentAction: 'NONE',
					edgeSliceStart: undefined,
				};
			}

			console.error(`Cannot slice edge while currentAction is ${state.currentAction}!`);
			return {};
		});
	},
}));
