import {type NodeId, type Edge, type EdgeId} from '../flowchart/graph';
import {useGraphStore} from '../flowchart/graphStore';
import {useClientRect} from '../hooks/useClientRect';

const containerStyle: React.CSSProperties = {
	position: 'absolute',
	inset: 0,
	userSelect: 'none',
	pointerEvents: 'none',
};

export function EdgeDisplay() {
	const edges = useGraphStore(state => state.edges);
	const nodes = useGraphStore(state => state.nodes);
	const removeEdge = useGraphStore(state => state.removeEdge);

	const {clientRef, clientRect} = useClientRect<SVGSVGElement>();

	const deleteEdge = (edgeId: EdgeId) => {
		removeEdge(edgeId);
	};

	const getNode = (nodeId: NodeId) => nodes.find(node => node.id === nodeId);

	return (
		<div style={containerStyle}>
			<svg
				width='100%'
				height='100%'
				stroke='black'
				ref={clientRef}
			>
				{edges.map(edge => {
					const sourceNode = getNode(edge.source);
					const targetNode = getNode(edge.target);
					return (
						<line
							onClick={() => {
								deleteEdge(edge.id);
							}}
							x1={(sourceNode?.position.x ?? 0) * clientRect.width}
							y1={(sourceNode?.position.y ?? 0) * clientRect.height}
							x2={(targetNode?.position.x ?? 0) * clientRect.width}
							y2={(targetNode?.position.y ?? 0) * clientRect.height}
							strokeWidth={2}
							style={{pointerEvents: 'all'}}
							key={edge.id}
						/>
					);
				})}
			</svg>
			<EdgeDisplayDebug edges={edges} />
		</div>
	);
}

interface GraphDisplayDebugProps {
	edges: Edge[];
}

const debugWrapperStyle: React.CSSProperties = {
	position: 'absolute',
	inset: 0,
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

function EdgeDisplayDebug({edges}: GraphDisplayDebugProps) {
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
