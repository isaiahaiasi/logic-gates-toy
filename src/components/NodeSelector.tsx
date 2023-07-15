// ListBox of Nodes that can be "picked up" and "placed" on the Graph.

import {type NodeTemplate} from '../state_management/uiStore';
import {GraphNodeListItem} from './GraphNodeListItem';

interface NodeSelectorProps {
	nodeTemplates: NodeTemplate[];
}

// NOTE: Probably nice to *keep* this a "presentational" component.
export function NodeSelector({nodeTemplates}: NodeSelectorProps) {
	return (
		<div>
			{nodeTemplates.map(template => (
				<GraphNodeListItem template={template} key={template.label} />
			))}
		</div>
	);
}
