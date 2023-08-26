import {type Vec2, v2Math} from '../utils/Vec2';

export type NodeId = string | number;
export type EdgeId = string | number;

export interface Node {
	id: NodeId;
	position: Vec2;
	size: number | Vec2;
	parent?: NodeId;
	children?: NodeId[];
	lockPosition?: boolean;
	lockExtension?: boolean;

	// NOTE: Should things associated with chips should be"
	// NOTE: - embedded, making Node generic (Node<T>) (and Zustand management nested generic...)
	// NOTE: - associated by ID, making the Graph stuff simpler, but requiring separate
	// NOTE:   state management for the actual Chip data...
	// NOTE: FOR NOW, we will split the difference, and have a mostly-useless `data` field
	data: {
		label: string;
	};

	// Node descriptions?: color/shape/style?
}

export interface Edge {
	id: EdgeId;
	source: NodeId;
	target: NodeId;
	// Edge descriptions?: corner management, additional points, color/style/etc?
}

/** Node position may be relative to parent,
 * so need to figure out what it is in "graph space"
 * */
export function getClientSpaceNodePosition(
	nodeId: NodeId,
	nodes: Record<NodeId, Node>,
	graphSize: {width: number; height: number}): Vec2 | undefined {
	const node = nodes[nodeId];
	const parent = node.parent && nodes[node.parent];

	if (!node) {
		return undefined;
	}

	const graphVec = {x: graphSize.width, y: graphSize.height};

	// TODO: Handle multiple-level nesting
	if (parent) {
		const parentPos = v2Math.multiply(parent.position, graphVec);
		const offset = v2Math.multiply(
			parent.size,
			v2Math.subtract(node.position, 0.5),
		);

		return v2Math.add(parentPos, offset);
	}

	return v2Math.multiply(node.position, graphVec);
}
