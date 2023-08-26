import {type Node} from '../flowchart/graph';
import {useGraphStore} from '../flowchart/graphStore';
import {useUiStore} from '../state_management/uiStore';
import {useDraggable} from '../hooks/useDraggable';
import {type PropsWithChildren} from 'react';
import {type Vec2} from '../utils/Vec2';

interface GraphNodeProps {
	node: Node;
}

const graphNodeStyle: React.CSSProperties = {
	position: 'absolute',
	userSelect: 'none',
	WebkitUserSelect: 'none',
	background: 'grey',
	borderRadius: '100px',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
};

function getNodeStyle(node: Node, mode: 'grab' | 'pointer' | 'not-allowed'): React.CSSProperties {
	const width = typeof node.size === 'number' ? node.size : node.size.x;
	const height = typeof node.size === 'number' ? node.size : node.size.y;

	return {
		width: `${width}px`,
		height: `${height}px`,
		top: `calc(${node.position.y * 100}% - ${height / 2}px)`,
		left: `calc(${node.position.x * 100}% - ${width / 2}px)`,
		cursor: mode,
	};
}

export function GraphNode({node}: GraphNodeProps) {
	const currentAction = useUiStore.use.currentAction();
	const nodes = useGraphStore.use.nodes();

	let Handle = NullHandle;

	switch (currentAction) {
		case 'SELECTING_NODE_TO_DRAG':
		case 'DRAGGING_NODE':
			if (!node.lockPosition) {
				Handle = MoveNodeHandle;
			}

			break;
		case 'ADDING_EDGE':
		case 'ADDING_NODE':
		case 'REMOVING_EDGE':
		case 'NONE':
			if (!node.lockExtension) {
				Handle = AddEdgeHandle;
			}

			break;
		default:
		// NullHandle already assigned as default case.
	}

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

function NullHandle({node, children}: GraphNodeHandleProps) {
	const style = getNodeStyle(node, 'not-allowed');
	return (
		<div
			onMouseDown={e => {
				e.preventDefault();
			}}
			style={{
				...graphNodeStyle,
				...style,
				background: 'grey',
			}}
		>
			{children}
		</div>
	);
}

function AddEdgeHandle({node, children}: GraphNodeHandleProps) {
	const addEdge = useGraphStore.use.addEdge();
	const dropEdge = useUiStore.use.dropEdge();
	const pickUpEdge = useUiStore.use.pickUpEdge();
	const heldEdgeSourceNode = useUiStore.use.sourceNode?.();

	const isHoldingEdge = heldEdgeSourceNode !== undefined;
	const isDrawingEdgeFromThis = heldEdgeSourceNode === node.id;

	// Adding edge
	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation();

		if (isDrawingEdgeFromThis) {
			// Clicking the node you're currently extending an edge from is a no-op.
			return;
		}

		if (isHoldingEdge) {
			addEdge({
				id: Date.now(),
				source: heldEdgeSourceNode,
				target: node.id,
				style: {active: false},
			});

			dropEdge();
		} else {
			pickUpEdge(node.id);
		}
	};

	const localStyle = getNodeStyle(node, 'pointer');

	return (
		<div
			onClick={handleClick}
			onMouseDown={e => {
				e.preventDefault();
			}}
			style={{
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
	const updateNode = useGraphStore.use.updateNode();

	const rect = useUiStore.use.clientRect();
	const startDraggingNode = useUiStore.use.startDraggingNode();
	const stopDraggingNode = useUiStore.use.stopDraggingNode();

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

	// TODO: Distinguish between 'grab' & 'grabbing'
	const localStyle = getNodeStyle(node, 'grab');

	return (
		<div
			ref={dragRef}
			onMouseDown={e => {
				e.preventDefault();
			}}
			style={{
				...graphNodeStyle,
				...localStyle,
				border: 'solid blue',
				background: pressed ? 'blue' : 'grey',
			}}
		>
			{children}
		</div>
	);
}
