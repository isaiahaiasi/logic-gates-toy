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

// TODO: Figure out how I want to handle styling.
const graphNodeStyle: React.CSSProperties = {
	position: 'absolute',
	width: `${nodeWidth}rem`,
	height: `${nodeHeight}rem`,
	userSelect: 'none',
	background: 'grey',
	borderRadius: '100px',
};

export function GraphNode({node}: GraphNodeProps) {
	const pickUpEdge = useUiStore(state => state.pickUpEdge);
	const dropEdge = useUiStore(state => state.dropEdge);
	const addEdge = useGraphStore(state => state.addEdge);

	// TODO: Find a way to pull sourceNode out so graph doesn't re-render
	//       every time an edge is picked up.
	const sourceNode = useUiStore(state => state.sourceNode);

	const handleClick: React.EventHandler<React.MouseEvent> = e => {
		e.stopPropagation();
		if (sourceNode === node.id) {
			return;
		}

		if (sourceNode) {
			addEdge({
				id: Date.now(),
				source: sourceNode,
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
			style={{...graphNodeStyle, ...localStyle}}
			onClick={handleClick}
		>
			{node.data.label}
		</div>
	);
}
