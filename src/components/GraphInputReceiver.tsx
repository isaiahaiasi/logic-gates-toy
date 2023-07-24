
import {useGraphStore} from '../flowchart/graphStore';
import {useClientRect} from '../hooks/useClientRect';
import {type UiPersistentAction, useUiStore} from '../state_management/uiStore';
import {doLinesIntersect} from '../utils/doLinesIntersect';

const style: React.CSSProperties = {
	position: 'absolute',
	inset: 0,
};

const inputHandlerStyle: React.CSSProperties = {
	height: '100%',
	width: '100%',
};

function getHandlerComponent(currentAction: UiPersistentAction) {
	switch (currentAction) {
		case 'NONE': return BeginEdgeSliceInputHandler;
		case 'ADDING_NODE': return AddNodeInputHandler;
		case 'REMOVING_EDGE': return RemoveEdgeInputHandler;
		case 'ADDING_EDGE': return DropEdgeInputHandler;
		default: return null;
	}
}

/**
 * Empty div that occupies the space of the graph & receives inputs.
 * Defines what happens when the user clicks on an UNOCCUPIED space on the graph
 * (because other graph elements should have already intercepted the click, if present).
 */
export function GraphInputReceiver() {
	const {clientRef, clientRect} = useClientRect<HTMLDivElement>();

	const currentAction = useUiStore(state => state.currentAction);

	const InputHandlerComponent = getHandlerComponent(currentAction);

	return (
		<div style={style} ref={clientRef}>
			{InputHandlerComponent && <InputHandlerComponent rect={clientRect} />}
		</div>
	);
}

interface InputHandlerProps {
	rect: DOMRect;
}

function AddNodeInputHandler({rect}: InputHandlerProps) {
	const heldNodeTemplate = useUiStore(state => state.heldNodeTemplate);
	const addNode = useGraphStore(state => state.addNode);

	// PLACE NODE
	if (!heldNodeTemplate) {
		throw new Error('INVALID STATE: ADDING_NODE without heldNodeTemplate!');
	}

	const handleClick = (e: React.MouseEvent) => {
		const spawnPosition = {
			x: (e.clientX - rect.x) / rect.width,
			y: (e.clientY - rect.y) / rect.height,
		};

		addNode(heldNodeTemplate.templateFn({spawnPosition}));
	};

	return <div style={inputHandlerStyle} onClick={handleClick} />;
}

function DropEdgeInputHandler() {
	const dropEdge = useUiStore(state => state.dropEdge);

	return <div style={inputHandlerStyle} onClick={dropEdge} />;
}

function BeginEdgeSliceInputHandler({rect}: InputHandlerProps) {
	const sliceEdge = useUiStore(state => state.sliceEdge);

	const handleClick = (e: React.MouseEvent) => {
		const slicePos = {
			x: e.clientX - rect.x,
			y: e.clientY - rect.y,
		};

		sliceEdge(slicePos);
	};

	return <div style={inputHandlerStyle} onClick={handleClick} />;
}

function RemoveEdgeInputHandler({rect}: InputHandlerProps) {
	const edges = useGraphStore(state => state.edges);
	const removeEdge = useGraphStore(state => state.removeEdge);
	const nodes = useGraphStore(state => state.nodes);

	const sliceEdge = useUiStore(state => state.sliceEdge);
	const edgeSliceStart = useUiStore(state => state.edgeSliceStart);

	const handleClick = (e: React.MouseEvent) => {
		const edgeSliceEnd = {
			x: e.clientX - rect.x,
			y: e.clientY - rect.y,
		};

		if (!edgeSliceStart) {
			throw new Error('INVALID STATE: REMOVING_EDGE without edgeSliceStart!');
		}

		const intersectingEdges = edges.filter(edge => {
			const source = nodes[edge.source];
			const target = nodes[edge.target];

			if (!source || !target) {
				console.error(`Could not find node with id ${source ? edge.target : edge.source}`);
				return false;
			}

			return doLinesIntersect(
				edgeSliceStart,
				edgeSliceEnd,
				{
					x: source.position.x * rect.width,
					y: source.position.y * rect.height,
				},
				{
					x: target.position.x * rect.width,
					y: target.position.y * rect.height,
				},
			);
		});

		const intersectingEdgeIds = intersectingEdges.map(edge => edge.id);

		sliceEdge(edgeSliceEnd);
		intersectingEdgeIds.forEach(removeEdge);
	};

	return <div style={inputHandlerStyle} onClick={handleClick} />;
}
