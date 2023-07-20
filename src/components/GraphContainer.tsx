import {NodeDisplay} from './NodeDisplay';
import {GraphInputReceiver} from './GraphInputReceiver';
import {SvgGraph} from './svg/SvgGraph';
import {SvgGraphEdges} from './svg/SvgGraphEdges';
import {SvgEdgeSlicer} from './svg/SvgEdgeSlicer';

// TODO: Figure out how I want to handle styling.
// (Will need to Search all `React.CSSProperties` for cleanup)
const graphContainerStyle: React.CSSProperties = {
	aspectRatio: '2/1',
	width: '100%',
	maxHeight: '100%',
	background: 'lightgrey',
	position: 'relative',
};

export function GraphContainer() {
	return (
		<div style={graphContainerStyle}>
			<GraphInputReceiver />
			<SvgGraph>
				<SvgGraphEdges />
				<SvgEdgeSlicer />
			</SvgGraph>
			<NodeDisplay />
		</div>
	);
}
