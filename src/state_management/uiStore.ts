import {create} from 'zustand';
import {type Node, type NodeId} from '../flowchart/graph';
import {type Vec2} from '../flowchart/Vec2';
import {createSelectors} from '../utils/zustandHelpers';

interface NodePlacementInfo {
	spawnPosition: Vec2;
}

export interface NodeTemplate {
	/** The function used to actually instantiate the Node. */
	templateFn: (info: NodePlacementInfo) => Node | Node[];

	/** The label used to represent the Template itself (eg, in a selection menu),
	 * NOT the label that will appear on each instance of the placed Node.
	 */
	label: string;
}

// NOTE: Not sure on "persistent" word choice.
/** Each exclusive option of the underlying UI State Machine */
export type UiPersistentAction =
	'ADDING_NODE' |
	'ADDING_EDGE' |
	'REMOVING_EDGE' |
	'SELECTING_NODE_TO_DRAG' | // HACK
	'DRAGGING_NODE' |
	'NONE';

interface UiState extends Record<string, unknown> {
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

	/** If REMOVING_EDGE, the starting position of the edge slice. */
	edgeSliceStart?: Vec2;

	clientRect: DOMRect;

	dragModeModifierHeld: boolean;
}

interface UiActions extends Record<string, unknown> {
	setClientRect: (clientRect: DOMRect) => void;
	pickUpNodeTemplate: (template: NodeTemplate) => void;
	dropNodeTemplate: () => void;
	pickUpEdge: (sourceId: NodeId) => void;
	dropEdge: () => void;
	sliceEdge: (pos: Vec2) => void;
	startDraggingNode: () => void;
	stopDraggingNode: () => void;
	setDragModeModifierHeld: (isHeld: boolean) => void;
}

// TODO: Write tests that guarantee invalid state is impossible
// - heldNodeTemplate must be set **IFF** currentAction ADDING_NODE
// - sourceNode must be set **IFF** currentAction ADDING_EDGE
// - edgeSliceStart must be set **IFF** currentAction REMOVING_EDGE
// - (that "and only if" means I need to test non-obvious paths thru State Machine graph)
const useUiStoreBase = create<UiState & UiActions>()(set => ({
	currentAction: 'NONE',

	clientRect: new DOMRect(0, 0, 0, 0),

	heldNodeTemplate: undefined,

	sourceNode: undefined,

	edgeSliceStart: undefined,

	dragModeModifierHeld: false,

	setClientRect(clientRect) {
		set(_ => ({clientRect}));
	},

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

	startDraggingNode() {
		set(_ => ({
			currentAction: 'DRAGGING_NODE',
			heldNodeTemplate: undefined,
			sourceNode: undefined,
			edgeSliceStart: undefined,
		}));
	},

	stopDraggingNode() {
		set(state => ({
			currentAction: state.dragModeModifierHeld ? 'SELECTING_NODE_TO_DRAG' : 'NONE',
			heldNodeTemplate: undefined,
			sourceNode: undefined,
			edgeSliceStart: undefined,
		}));
	},

	setDragModeModifierHeld(isHeld) {
		set(_ => ({
			currentAction: isHeld ? 'SELECTING_NODE_TO_DRAG' : 'NONE',
			dragModeModifierHeld: isHeld,
		}));
	},
}));

export const useUiStore = createSelectors(useUiStoreBase);
