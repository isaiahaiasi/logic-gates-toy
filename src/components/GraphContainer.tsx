import {GraphDisplay} from './GraphDisplay';
import {GraphInputReceiver} from './GraphInputReceiver';

// TODO: Figure out how I want to handle styling.
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
			<GraphDisplay />
		</div>
	);
}
