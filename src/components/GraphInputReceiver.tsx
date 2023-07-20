
import {type NodeId, type Vec2} from '../flowchart/graph';
import {useGraphStore} from '../flowchart/graphStore';
import {useClientRect} from '../hooks/useClientRect';
import {useUiStore} from '../state_management/uiStore';
import {doLinesIntersect} from '../utils/doLinesIntersect';

// TODO: Figure out how I want to handle styling.
const style: React.CSSProperties = {
	position: 'absolute',
	inset: 0,
};

function getPosition(
	mouseX: number,
	mouseY: number,
	boundingClientRect: DOMRect,
): Vec2 {
	const {top, left, width, height} = boundingClientRect;
	return {
		x: (mouseX - left) / width,
		y: (mouseY - top) / height,
	};
}

/**
 * Empty div that occupies the space of the graph & receives inputs.
 * Defines what happens when the user clicks on an UNOCCUPIED space on the graph
 * (because other graph elements should have already intercepted the click, if present).
 */
export function GraphInputReceiver() {
	const {clientRef, clientRect} = useClientRect<HTMLDivElement>();

	const addNode = useGraphStore(state => state.addNode);
	const edges = useGraphStore(state => state.edges);
	const nodes = useGraphStore(state => state.nodes);
	// TODO: probably want to be able to call this with more than one edge.
	const removeEdge = useGraphStore(state => state.removeEdge);

	const currentAction = useUiStore(state => state.currentAction);
	const heldNodeTemplate = useUiStore(state => state.heldNodeTemplate);
	const edgeSliceStart = useUiStore(state => state.edgeSliceStart);
	const sliceEdge = useUiStore(state => state.sliceEdge);
	const dropEdge = useUiStore(state => state.dropEdge);

	const getIntersectingEdgeIds = (sliceStart: Vec2, sliceEnd: Vec2) => {
		// TODO: This is truly ridiculous...
		const getNode = (id: NodeId) => nodes.find(node => node.id === id);
		const scaleVecToClient = (pos: Vec2): Vec2 => ({
			x: pos.x * clientRect.width,
			y: pos.y * clientRect.height,
		});

		const intersectingEdges = edges.filter(edge => {
			const source = getNode(edge.source);
			const target = getNode(edge.target);

			if (!source || !target) {
				return false;
			}

			return doLinesIntersect(
				sliceStart,
				sliceEnd,
				scaleVecToClient(source.position),
				scaleVecToClient(target.position),
			);
		});

		return intersectingEdges.map(edge => edge.id);
	};

	const handleClick = (e: React.MouseEvent) => {
		// NOTE: Find a better strategy than "giant unwieldy switch"?
		switch (currentAction) {
			case 'NONE': {
				// Begin edge slice
				const slicePos = {
					x: e.clientX - clientRect.x,
					y: e.clientY - clientRect.y,
				};

				sliceEdge(slicePos);
				break;
			}

			case 'REMOVING_EDGE': {
				// Finish edge slice & remove edges that intersect slice
				const edgeSliceEnd = {
					x: e.clientX - clientRect.x,
					y: e.clientY - clientRect.y,
				};

				if (!edgeSliceStart) {
					throw new Error('INVALID STATE: REMOVING_EDGE without edgeSliceStart!');
				}

				const intersectingEdges = getIntersectingEdgeIds(edgeSliceStart, edgeSliceEnd);

				console.log(intersectingEdges);

				sliceEdge(edgeSliceEnd);
				intersectingEdges.forEach(removeEdge);
				break;
			}

			case 'ADDING_EDGE': {
				// Cancel adding edge
				dropEdge();
				break;
			}

			case 'ADDING_NODE': {
				// PLACE NODE
				if (!heldNodeTemplate) {
					console.error('INVALID STATE: ADDING_NODE without heldNodeTemplate!');
					return;
				}

				const spawnPosition = getPosition(
					e.clientX,
					e.clientY,
					e.currentTarget.getBoundingClientRect(),
				);

				addNode(heldNodeTemplate.templateFn({spawnPosition}));

				break;
			}

			default: {
				console.error(`UI Action not handled by GraphInputReceiver: ${currentAction as string}`);
			}
		}
	};

	return (
		<div style={style} onClick={handleClick} ref={clientRef} />
	);
}
