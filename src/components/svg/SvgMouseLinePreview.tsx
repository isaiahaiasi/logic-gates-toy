import {useContext} from 'react';
import {useMouseMove} from '../../hooks/useMouseMove';
import {useUiStore} from '../../state_management/uiStore';
import {GraphSvgContext} from '../../state_management/clientRectContext';
import {useGraphStore} from '../../flowchart/graphStore';
import {type Vec2} from '../../flowchart/graph';

// NOTE: This wrapping component might not really be necessary.
export function SvgMouseLinePreview() {
	const currentAction = useUiStore(state => state.currentAction);

	// NOTE: mousePos is (0, 0) on 1st render,  so I can't actually use this hook
	// NOTE: at the level the component is actually rendered. Not ideal!
	const mousePos = useMouseMove();

	switch (currentAction) {
		case 'REMOVING_EDGE':
			return <SvgEdgeSlicer mousePos={mousePos} />;
		case 'ADDING_EDGE':
			return <SvgEdgePreview mousePos={mousePos} />;
		default:
			return null;
	}
}

interface SvgMouseLinePreviewProps {
	mousePos: Vec2;
}

function SvgEdgeSlicer({mousePos}: SvgMouseLinePreviewProps) {
	const {rect} = useContext(GraphSvgContext);

	const edgeSliceStart = useUiStore(state => state.edgeSliceStart);

	if (!edgeSliceStart) {
		throw new Error('Invalid UI State in SvgEdgeSlicer: no edgeSliceStart!');
	}

	return <line
		x1={edgeSliceStart.x}
		y1={edgeSliceStart.y}
		x2={mousePos.x - rect.x}
		y2={mousePos.y - rect.y}
		strokeWidth={2}
		stroke={'red'}
	/>;
}

function SvgEdgePreview({mousePos}: SvgMouseLinePreviewProps) {
	const {rect} = useContext(GraphSvgContext);

	const sourceNodeId = useUiStore(state => state.sourceNode);

	if (!sourceNodeId) {
		throw new Error('Invalid UI State in SvgEdgePreview: no current sourceNode!');
	}

	const nodes = useGraphStore(state => state.nodes);
	const node = nodes[sourceNodeId];

	if (!node) {
		throw new Error(`Could not find node with id ${sourceNodeId ?? '<undefined>'}!`);
	}

	return <line
		x1={node.position.x * rect.width}
		y1={node.position.y * rect.height}
		x2={mousePos.x - rect.x}
		y2={mousePos.y - rect.y}
		strokeWidth={2}
		stroke={'grey'}
	/>;
}
