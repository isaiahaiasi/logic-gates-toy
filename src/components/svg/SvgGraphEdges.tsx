import {getClientSpaceNodePosition} from '../../flowchart/graph';
import {useGraphStore} from '../../flowchart/graphStore';
import {useUiStore} from '../../state_management/uiStore';

export function SvgGraphEdges() {
	const rect = useUiStore(state => state.clientRect);
	const edges = useGraphStore(state => state.edges);
	const nodes = useGraphStore(state => state.nodes);

	return (
		<>{edges.map(edge => {
			const sourceNodePos = getClientSpaceNodePosition(edge.source, nodes, rect);
			const targetNodePos = getClientSpaceNodePosition(edge.target, nodes, rect);

			if (!sourceNodePos || !targetNodePos) {
				return null;
			}

			return (
				<line
					x1={sourceNodePos.x}
					y1={sourceNodePos.y}
					x2={targetNodePos.x}
					y2={targetNodePos.y}
					strokeWidth={2}
					style={{pointerEvents: 'all'}}
					key={edge.id}
				/>
			);
		})}</>
	);
}
