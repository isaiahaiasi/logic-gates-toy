// ListBox of Nodes that can be "picked up" and "placed" on the Graph.

import {type NodeTemplate} from '../state_management/uiStore';
import {GraphNodeListItem} from './GraphNodeListItem';

interface NodeSelectorProps {
	nodeTemplates: NodeTemplate[];
}

const style: React.CSSProperties = {
	display: 'flex',
	flexDirection: 'column',
};

export function NodeSelector({nodeTemplates}: NodeSelectorProps) {
	return (
		<div style={style}>
			{nodeTemplates.map(template => (
				<GraphNodeListItem template={template} key={template.label} />
			))}
		</div>
	);
}
