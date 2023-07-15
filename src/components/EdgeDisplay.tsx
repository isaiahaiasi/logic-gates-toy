import {useLayoutEffect, useRef, useState} from 'react';
import {type NodeId, type Edge} from '../flowchart/graph';
import {useGraphStore} from '../flowchart/graphStore';

const containerStyle: React.CSSProperties = {
	position: 'absolute',
	inset: 0,
	userSelect: 'none',
	pointerEvents: 'none',
};

const debugStyle: React.CSSProperties = {
	position: 'absolute',
	top: '0.2rem',
	right: '0.2rem',
	color: 'grey',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'end',
	alignItems: 'end',
};

export function EdgeDisplay() {
	const edges = useGraphStore(state => state.edges);
	const nodes = useGraphStore(state => state.nodes);

	const ref = useRef<SVGSVGElement>(null);
	const [svgHeight, setSvgHeight] = useState(0);
	const [svgWidth, setSvgWidth] = useState(0);

	useLayoutEffect(() => {
		if (!ref.current) {
			return;
		}

		const {height, width} = ref.current.getBoundingClientRect();
		setSvgHeight(height);
		setSvgWidth(width);
	}, []);

	const getNode = (nodeId: NodeId) => nodes.find(node => node.id === nodeId);

	return (
		<div style={containerStyle}>
			<svg
				width='100%'
				height='100%'
				stroke='black'
				ref={ref}
			>
				{edges.map(edge => {
					const sourceNode = getNode(edge.source);
					const targetNode = getNode(edge.target);
					return (
						<line
							key={edge.id}
							x1={(sourceNode?.position.x ?? 0) * svgWidth}
							y1={(sourceNode?.position.y ?? 0) * svgHeight}
							x2={(targetNode?.position.x ?? 0) * svgWidth}
							y2={(targetNode?.position.y ?? 0) * svgHeight}
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

function EdgeDisplayDebug({edges}: GraphDisplayDebugProps) {
	return (
		<div style={debugStyle}>
			{edges.map(edge =>
				<div key={edge.id}>{edge.source} &rarr; {edge.target}</div>,
			)}
		</div>
	);
}
