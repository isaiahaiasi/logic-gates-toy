import {useGraphStore} from '../../flowchart/graphStore';
import {GraphEdgesDebug} from './GraphEdgesDebug';

export function GraphDebugContainer() {
	const edges = useGraphStore(state => state.edges);
	return (
		<div><GraphEdgesDebug edges={edges} /></div>
	);
}
