import {GraphDebugContainer} from './GraphDebugContainer';
import {UiStateInfo} from './UiStateInfo';

const debugInfoStyle: React.CSSProperties = {
	textAlign: 'left',
	display: 'flex',
	justifyContent: 'space-between',
};

export function DebugInfo() {
	return (
		<div style={debugInfoStyle}>
			<UiStateInfo />
			<GraphDebugContainer />
		</div>
	);
}
