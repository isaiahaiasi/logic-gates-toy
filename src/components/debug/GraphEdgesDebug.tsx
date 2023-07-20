import {type Edge} from '../../flowchart/graph';

interface GraphDisplayDebugProps {
	edges: Edge[];
}

const debugWrapperStyle: React.CSSProperties = {
	color: 'grey',
	height: '100%',
	overflowY: 'scroll',
};

const debugStyle: React.CSSProperties = {
	position: 'relative',
	inset: 0,
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'end',
	alignItems: 'end',
};

export function GraphEdgesDebug({edges}: GraphDisplayDebugProps) {
	return (
		<div style={debugWrapperStyle}>
			<div style={debugStyle}>
				{edges.map(edge =>
					<div key={edge.id}>{edge.source} &rarr; {edge.target}</div>,
				)}
			</div>
		</div>
	);
}
