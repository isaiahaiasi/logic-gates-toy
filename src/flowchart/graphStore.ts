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

// TODO: Add tests to ensure validity of graph is preserved
// - Adding a node should actually add a node.
// - Adding an edge should actually add an edge.
// - Should not be able to add a "redundant" edge.
// - Removing a node should remove all associated edges.
// - Removing a node should remove all of its child nodes.
// - Edges must have two *existing* nodes.
// - A node must have either no parent, or an *existing* parent.
export const useGraphStore = create<GraphStoreState & GraphStoreActions>()(set => ({
	nodes: [],
	edges: [],
	addNode(node) {
		set(state => ({
			nodes: [...state.nodes, node],
		}),
		);
	},
	removeNode(id) {
		set(state => ({
			nodes: state.nodes.filter(node => node.id !== id),
			edges: state.edges
				.filter(edge => edge.source !== id && edge.target !== id),
		}),
		);
	},
	addEdge(edge) {
		set(state => ({edges: [...state.edges, edge]}));
	},
	removeEdge(id) {
		throw new Error('Not Implemented Yet!');
	},
	updateNode(node) {
		throw new Error('Not Implemented Yet!');
	},
}));
