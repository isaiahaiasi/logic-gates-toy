import {create} from 'zustand';
import {type NodeId, type Edge, type Node, type EdgeId} from './graph';

interface GraphStoreState {
	nodes: Record<NodeId, Node>;
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
	nodes: {},
	edges: [],

	addNode(node) {
		set(state => ({
			nodes: {...state.nodes, [node.id]: node},
		}),
		);
	},

	removeNode(id) {
		set(state => {
			const {[id]: _discard, ...nodes} = state.nodes;
			return {
				nodes,
				edges: state.edges
					.filter(edge => edge.source !== id && edge.target !== id),
			};
		});
	},

	addEdge(edge) {
		set(state => {
			// Despite `source` & `target`, we're treating this as an
			// __UNDIRECTED__ graph for the purposes of edge duplication testing.
			// (AKA, A->B == B->A)
			const undirectedEdgeAlreadyExists = state.edges.some(e =>
				(e.source === edge.source && e.target === edge.target)
				|| (e.source === edge.target && e.target === edge.source),
			);

			if (undirectedEdgeAlreadyExists) {
				return {};
			}

			return {edges: [...state.edges, edge]};
		});
	},

	removeEdge(id) {
		set(state => ({edges: state.edges.filter(edge => edge.id !== id)}));
	},

	updateNode(_node) {
		throw new Error('Not Implemented Yet!');
	},
}));
