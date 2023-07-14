import {create} from 'zustand';
import {type NodeId, type Edge, type Node, type EdgeId} from './graph';

interface GraphStoreState {
	nodes: Node[];
	edges: Edge[];
}

interface GraphStoreActions {
	addNode: (node: Node) => void;
	removeNode: (nodeId: NodeId) => void;
	addEdge: (edge: Edge) => void;
	removeEdge: (edgeId: EdgeId) => void;
	updateNode: (node: Node) => void;
}

interface GraphStoreListeners {
	onAddNode?(node: Node): void;
	onRemoveNode?(id: NodeId): void;
	onAddEdge?(edge: Edge): void;
	onRemoveEdge?(id: EdgeId): void;
}

// NOTE: Not sure this is actually a good idea.
// The thought process is, I don't really want the Graph UI state
// to be the source-of-truth for my Circuit state. This method lets me provide
// listeners to inform the Circuit when changes have been made thru the UI.
function getGraphStoreHook(listeners?: GraphStoreListeners) {
	return create<GraphStoreState & GraphStoreActions>(set => ({
		nodes: [],
		edges: [],
		addNode(node) {
			if (listeners?.onAddNode) {
				listeners.onAddNode(node);
			}

			set(state => ({
				nodes: [...state.nodes, node],
				edges: state.edges
					.filter(edge => edge.source !== node.id && edge.target !== node.id),
			}),
			);
		},
		removeNode(id) {
			if (listeners?.onRemoveNode) {
				listeners.onRemoveNode(id);
			}

			throw new Error('Not Implemented Yet!');
		},
		addEdge(edge) {
			if (listeners?.onAddEdge) {
				listeners.onAddEdge(edge);
			}

			throw new Error('Not Implemented Yet!');
		},
		removeEdge(id) {
			if (listeners?.onRemoveEdge) {
				listeners.onRemoveEdge(id);
			}

			throw new Error('Not Implemented Yet!');
		},
		updateNode(node) {
			throw new Error('Not Implemented Yet!');
		},
	}));
}

export const useGraphStore = getGraphStoreHook();
