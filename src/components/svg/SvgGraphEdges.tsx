import {getClientSpaceNodePosition} from '../../flowchart/graph';
import {useGraphStore} from '../../flowchart/graphStore';
import {useUiStore} from '../../state_management/uiStore';

export function SvgGraphEdges() {
	const rect = useUiStore.use.clientRect();
	const edges = useGraphStore.use.edges();
	const nodes = useGraphStore.use.nodes();

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
