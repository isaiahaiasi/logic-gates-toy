import {useGraphStore} from '../flowchart/graphStore';
import {GraphNode} from './GraphNode';

const style: React.CSSProperties = {
	width: '100%',
	height: '100%',
};

export function NodeDisplay() {
	const nodes = useGraphStore.use.nodes();

	return (
		<div style={style}>
			{ // Only render "top level" nodes.
				Object.values(nodes)
					.filter(node => !node.parent)
					.map(node => <GraphNode node={node} key={node.id} />)
			}
		</div>
	);
}
