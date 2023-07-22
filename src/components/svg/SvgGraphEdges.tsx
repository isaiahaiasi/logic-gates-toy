import {useGraphStore} from '../../flowchart/graphStore';
import {useUiStore} from '../../state_management/uiStore';

export function SvgGraphEdges() {
	const rect = useUiStore(state => state.clientRect);
	const edges = useGraphStore(state => state.edges);
	const nodes = useGraphStore(state => state.nodes);

	return (
		<>{edges.map(edge => {
			const sourceNode = nodes[edge.source];
			const targetNode = nodes[edge.target];

			return (
				<line
					x1={(sourceNode?.position.x ?? 0) * rect.width}
					y1={(sourceNode?.position.y ?? 0) * rect.height}
					x2={(targetNode?.position.x ?? 0) * rect.width}
					y2={(targetNode?.position.y ?? 0) * rect.height}
					strokeWidth={2}
					style={{pointerEvents: 'all'}}
					key={edge.id}
				/>
			);
		})}</>
	);
}
