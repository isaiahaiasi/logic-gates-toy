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

// TODO: If these aren't going to be used, remove them.
interface GraphStoreListeners {
	onAddNode?(node: Node): void;
	onRemoveNode?(id: NodeId): void;
	onAddEdge?(edge: Edge): void;
	onRemoveEdge?(id: EdgeId): void;
}

// TODO: Add tests to ensure validity of graph is preserved
// - Adding a node should actually add a node.
// - Adding an edge should actually add an edge.
// - Should not be able to add a "redundant" edge.
// - Removing a node should remove all associated edges.
// - Removing a node should remove all of its child nodes.
// - Edges must have two *existing* nodes.
// - A node must have either no parent, or an *existing* parent.
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
			}),
			);
		},
		removeNode(id) {
			if (listeners?.onRemoveNode) {
				listeners.onRemoveNode(id);
			}

			set(state => ({
				nodes: state.nodes.filter(node => node.id !== id),
				edges: state.edges
					.filter(edge => edge.source !== id && edge.target !== id),
			}),
			);
		},
		addEdge(edge) {
			if (listeners?.onAddEdge) {
				listeners.onAddEdge(edge);
			}

			set(state => ({edges: [...state.edges, edge]}));
		},
		removeEdge(id) {
			if (listeners?.onRemoveEdge) {
				listeners.onRemoveEdge(id);
			}

			throw new Error('Not Implemented Yet!');
		},
		updateNode(_) {
			throw new Error('Not Implemented Yet!');
		},
	}));
}

export const useGraphStore = getGraphStoreHook();
