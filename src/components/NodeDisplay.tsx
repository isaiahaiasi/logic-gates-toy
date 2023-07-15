import {useGraphStore} from '../flowchart/graphStore';
import {GraphNode} from './GraphNode';

// TODO: Style
const style: React.CSSProperties = {
	width: '100%',
	height: '100%',
};

export function NodeDisplay() {
	const nodes = useGraphStore(state => state.nodes);

	return (
		<div style={style}>
			{nodes.map(node => <GraphNode node={node} key={node.id} />)}
		</div>
	);
}
