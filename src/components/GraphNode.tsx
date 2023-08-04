import {type Node} from '../flowchart/graph';
import {useGraphStore} from '../flowchart/graphStore';
import {useUiStore} from '../state_management/uiStore';
import {useDraggable} from '../hooks/useDraggable';
import {type PropsWithChildren} from 'react';
import {type Vec2} from '../flowchart/Vec2';

interface GraphNodeProps {
	node: Node;
}

const graphNodeStyle: React.CSSProperties = {
	position: 'absolute',
	userSelect: 'none',
	background: 'grey',
	borderRadius: '100px',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
};

function getNodeStyle(node: Node): React.CSSProperties {
	const width = typeof node.size === 'number' ? node.size : node.size.x;
	const height = typeof node.size === 'number' ? node.size : node.size.y;

	return {
		width: `${width}px`,
		height: `${height}px`,
		top: `calc(${node.position.y * 100}% - ${height / 2}px)`,
		left: `calc(${node.position.x * 100}% - ${width / 2}px)`,
	};
}

export function GraphNode({node}: GraphNodeProps) {
	const currentAction = useUiStore(state => state.currentAction);
	const nodes = useGraphStore(state => state.nodes);

	const activateDragHandle
		= currentAction === 'SELECTING_NODE_TO_DRAG'
		|| currentAction === 'DRAGGING_NODE';

	const Handle = activateDragHandle ? MoveNodeHandle : AddEdgeHandle;

	return (
		<Handle node={node}>
			{node.children?.map(childId => {
				const childNode = nodes[childId];
				return childNode && <GraphNode node={childNode} key={childNode.id} />;
			})}
			{node.data.label}
		</Handle>
	);
}

interface GraphNodeHandleProps extends PropsWithChildren {
	node: Node;
}

function AddEdgeHandle({node, children}: GraphNodeHandleProps) {
	const addEdge = useGraphStore(state => state.addEdge);
	const dropEdge = useUiStore(state => state.dropEdge);
	const pickUpEdge = useUiStore(state => state.pickUpEdge);
	const heldEdgeSourceNode = useUiStore(state => state.sourceNode);

	const isDrawingEdgeFromThis = heldEdgeSourceNode === node.id;

	// Adding edge
	const handleClick = (e: React.MouseEvent) => {
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

	const localStyle = getNodeStyle(node);

	return (
		<div onClick={handleClick} style={{
			...graphNodeStyle,
			...localStyle,
			background: isDrawingEdgeFromThis ? '#59787e' : 'grey',
		}}
		>
			{children}
		</div>
	);
}

function MoveNodeHandle({node, children}: GraphNodeHandleProps) {
	const updateNode = useGraphStore(state => state.updateNode);

	const rect = useUiStore(state => state.clientRect);
	const startDraggingNode = useUiStore(state => state.startDraggingNode);
	const stopDraggingNode = useUiStore(state => state.stopDraggingNode);

	const handleDrag = (pos: Vec2) => {
		const position = {
			x: pos.x / rect.width,
			y: pos.y / rect.height,
		};

		updateNode({...node, position});

		return pos;
	};

	const [dragRef, pressed] = useDraggable({
		onDrag: handleDrag,
		onDragStart() {
			startDraggingNode();
		},
		onDragEnd() {
			stopDraggingNode();
		},
		initialPosition: {
			x: node.position.x * rect.width,
			y: node.position.y * rect.height,
		},
	});

	const localStyle = getNodeStyle(node);

	return (
		<div ref={dragRef} style={{
			...graphNodeStyle,
			...localStyle,
			border: 'solid blue',
			background: pressed ? 'blue' : 'grey',
		}}>
			{children}
		</div>
	);
}
