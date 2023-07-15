import {type Edge} from '../flowchart/graph';
import {useGraphStore} from '../flowchart/graphStore';

export function EdgeDisplay() {
	const edges = useGraphStore(state => state.edges);

	return (
		<div>
			{edges.map(edge => <GraphEdge edge={edge} key={edge.id} />)}
		</div>
	);
}

interface GraphEdgeProps {
	edge: Edge;
}

function GraphEdge({edge}: GraphEdgeProps) {
	return <div>{edge.source} &rarr; {edge.target}</div>;
}
