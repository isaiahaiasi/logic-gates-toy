import {type Node} from '../flowchart/graph';
import {useGraphStore} from '../flowchart/graphStore';
import {useUiStore} from '../state_management/uiStore';

interface GraphNodeProps {
	node: Node;
}

// These are tracked externally as numbers so that we can do math operations.
// Specifically: find the middle so they spawn in CENTERED ON click position.
const nodeHeight = 1.25; // `rem`
const nodeWidth = 5; // `rem`

const graphNodeStyle: React.CSSProperties = {
	position: 'absolute',
	width: `${nodeWidth}rem`,
	height: `${nodeHeight}rem`,
	userSelect: 'none',
	background: 'grey',
	borderRadius: '100px',
};

const graphNodeActiveStyle: React.CSSProperties = {
	background: '#59787e',
};

export function GraphNode({node}: GraphNodeProps) {
	const pickUpEdge = useUiStore(state => state.pickUpEdge);
	const dropEdge = useUiStore(state => state.dropEdge);
	const addEdge = useGraphStore(state => state.addEdge);

	// TODO: Find a way to pull sourceNode out so graph doesn't re-render
	//       every time an edge is picked up.
	const heldEdgeSourceNode = useUiStore(state => state.sourceNode);

	const isDrawingEdgeFromThis = heldEdgeSourceNode === node.id;
	const activeStyle = isDrawingEdgeFromThis ? graphNodeActiveStyle : {};

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

	const localStyle: React.CSSProperties = {
		top: `calc(${node.position.y * 100}% - ${nodeHeight / 2}rem)`,
		left: `calc(${node.position.x * 100}% - ${nodeWidth / 2}rem)`,
	};

	return (
		<div
			style={{
				...graphNodeStyle,
				...localStyle,
				...activeStyle,
			}}
			onClick={handleClick}
		>
			{node.data.label}
		</div>
	);
}
