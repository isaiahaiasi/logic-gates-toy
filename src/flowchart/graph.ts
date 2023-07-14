export interface Vec2 {
	x: number;
	y: number;
}

export type NodeId = string | number;
export type EdgeId = string | number;

export interface Node {
	id: NodeId;
	position: Vec2;

	// NOTE: Should things associated with chips should be"
	// NOTE: - embedded, making Node generic (Node<T>) (and Zustand management nested generic...)
	// NOTE: - associated by ID, making the Graph stuff simpler, but requiring separate
	// NOTE:   state management for the actual Chip data...
	// NOTE: FOR NOW, we will split the difference, and have a mostly-useless `data` field
	data: {
		label: string;
	};
	parent?: NodeId;
	// Node descriptions?: color/shape/style?
}

export interface Edge {
	id: EdgeId;
	source: NodeId;
	target: NodeId;
	// Edge descriptions?: corner management, additional points, color/style/etc?
}
