import {type Node} from '../flowchart/graph';
import {useGraphStore} from '../flowchart/graphStore';
import {useUiStore} from '../state_management/uiStore';

interface GraphNodeProps {
	node: Node;
}

// These are tracked externally as numbers so that we can do math operations.
// Specifically: find the middle so they spawn in CENTERED ON click position.

const graphNodeStyle: React.CSSProperties = {
	position: 'absolute',
	userSelect: 'none',
	background: 'grey',
	borderRadius: '100px',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
};

export function GraphNode({node}: GraphNodeProps) {
	const pickUpEdge = useUiStore(state => state.pickUpEdge);
	const dropEdge = useUiStore(state => state.dropEdge);
	const addEdge = useGraphStore(state => state.addEdge);

	// TODO: Find a way to pull sourceNode out so graph doesn't re-render
	//       every time an edge is picked up.
	const heldEdgeSourceNode = useUiStore(state => state.sourceNode);

	const isDrawingEdgeFromThis = heldEdgeSourceNode === node.id;

	const width = typeof node.size === 'number' ? node.size : node.size.x;
	const height = typeof node.size === 'number' ? node.size : node.size.y;

	const localStyle: React.CSSProperties = {
		background: isDrawingEdgeFromThis ? '#59787e' : 'grey',
		width: `${width}rem`,
		height: `${height}rem`,
		top: `calc(${node.position.y * 100}% - ${height / 2}rem)`,
		left: `calc(${node.position.x * 100}% - ${width / 2}rem)`,
	};

	const handleClick: React.EventHandler<React.MouseEvent> = e => {
		e.stopPropagation();
		if (isDrawingEdgeFromThis) {
			return;
		}

		if (heldEdgeSourceNode) {
			addEdge({
				id: Date.now(),
				source: heldEdgeSourceNode,
				target: node.id,
			});

			dropEdge();
		} else {
			pickUpEdge(node.id);
		}
	};

	return (
		<div
			style={{
				...graphNodeStyle,
				...localStyle,
			}}
			onClick={handleClick}
		>
			{node.data.label}
		</div>
	);
}
