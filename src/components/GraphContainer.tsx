// NOTE: Should I try to do a better job of following the "container" pattern
// NOTE: to separate my "logical" components from my "presentational" components?

import {type Vec2} from '../flowchart/graph';
import {useGraphStore} from '../flowchart/graphStore';
import {GraphNode} from './GraphNode';

// TODO: Figure out how I want to handle styling.
const graphContainerStyle: React.CSSProperties = {
	aspectRatio: '1/1',
	width: '100%',
	height: '100%',
	background: 'lightgrey',
	position: 'relative',
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

export function GraphContainer() {
	const nodes = useGraphStore(state => state.nodes);
	const addNode = useGraphStore(state => state.addNode);

	const handleClick: React.EventHandler<React.MouseEvent> = e => {
		const position = getPosition(
			e.clientX,
			e.clientY,
			e.currentTarget.getBoundingClientRect(),
		);

		addNode({
			position,
			id: Date.now().toString(),
			data: {label: `${Math.round(position.x * 100)}, ${Math.round(position.y * 100)}`},
		});
	};

	return (
		<div style={graphContainerStyle} onClick={handleClick}>
			{nodes.map(node => <GraphNode node={node} key={node.id} />)}
		</div>
	);
}
