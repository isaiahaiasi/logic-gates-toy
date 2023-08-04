import {gateTemplates} from '../logic/GateNodeTemplates';
import {GraphNodeListItem} from './GraphNodeListItem';

const style: React.CSSProperties = {
	display: 'flex',
	flexDirection: 'column',
};

export function NodeSelector() {
	return (
		<div style={style}>
			{gateTemplates.map(template => (
				<GraphNodeListItem template={template} key={template.label} />
			))}
		</div>
	);
}
