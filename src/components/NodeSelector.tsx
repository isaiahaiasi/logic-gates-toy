// ListBox of Nodes that can be "picked up" and "placed" on the Graph.

import {type NodeTemplate} from '../state_management/uiStore';
import {GraphNodeListItem} from './GraphNodeListItem';

const nodeTemplates: NodeTemplate[] = [
	{
		label: 'AND',
		templateFn: info => ({
			id: `AND:${Date.now()}`,
			position: info.spawnPosition,
			size: {x: 5, y: 3},
			data: {
				label: `A:${Math.round(info.spawnPosition.x * 100)}|${Math.round(info.spawnPosition.y * 100)}`,
			},
		}),
	},
	{
		label: 'NOT',
		templateFn: info => ({
			id: `NOT:${Date.now()}`,
			position: info.spawnPosition,
			size: {x: 4, y: 2},
			data: {
				label: `N:${Math.round(info.spawnPosition.x * 100)}|${Math.round(info.spawnPosition.y * 100)}`,
			},
		}),
	},
	{
		label: 'OR',
		templateFn: info => ({
			id: `OR:${Date.now()}`,
			position: info.spawnPosition,
			size: 4,
			data: {
				label: `O:${Math.round(info.spawnPosition.x * 100)}|${Math.round(info.spawnPosition.y * 100)}`,
			},
		}),
	},
];

const style: React.CSSProperties = {
	display: 'flex',
	flexDirection: 'column',
};

export function NodeSelector() {
	return (
		<div style={style}>
			{nodeTemplates.map(template => (
				<GraphNodeListItem template={template} key={template.label} />
			))}
		</div>
	);
}
