import {useContext} from 'react';
import {GraphSvgContext} from '../state_management/clientRectContext';
import {useGraphStore} from '../flowchart/graphStore';
import {type EdgeId, type NodeId} from '../flowchart/graph';

export function SvgGraphEdges() {
	const {rect} = useContext(GraphSvgContext);
	const edges = useGraphStore(state => state.edges);
	const nodes = useGraphStore(state => state.nodes);
	const removeEdge = useGraphStore(state => state.removeEdge);

	const deleteEdge = (edgeId: EdgeId) => {
		removeEdge(edgeId);
	};

	// TODO: Stop iterating twice over the node array for every edge.
	const getNode = (nodeId: NodeId) => nodes.find(node => node.id === nodeId);

	return (
		<>{edges.map(edge => {
			const sourceNode = getNode(edge.source);
			const targetNode = getNode(edge.target);

			return (
				<line
					onClick={() => {
						deleteEdge(edge.id);
					}}
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
