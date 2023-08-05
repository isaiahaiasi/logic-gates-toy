import {NodeDisplay} from './NodeDisplay';
import {GraphInputReceiver} from './GraphInputReceiver';
import {SvgGraph} from './svg/SvgGraph';
import {SvgGraphEdges} from './svg/SvgGraphEdges';
import {SvgMouseLinePreview} from './svg/SvgMouseLinePreview';
import {useClientRect} from '../hooks/useClientRect';
import {useUiStore} from '../state_management/uiStore';
import {useKeyEvent} from '../hooks/useKeyEvent';

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
	const setClientRect = useUiStore(state => state.setClientRect);
	const {clientRef} = useClientRect<HTMLDivElement>(setClientRect);

	const setDragModeModifierHeld = useUiStore(state => state.setDragModeModifierHeld);

	// TODO: Drag Modifier should be part of UI Configuration, not hard-coded.
	const dragModeKey = 'Shift';
	useKeyEvent('keydown', dragModeKey, () => {
		setDragModeModifierHeld(true);
	});
	useKeyEvent('keyup', dragModeKey, () => {
		setDragModeModifierHeld(false);
	});

	return (
		<div style={graphContainerStyle} ref={clientRef}>
			<GraphInputReceiver />
			<SvgGraph>
				<SvgGraphEdges />
				<SvgMouseLinePreview />
			</SvgGraph>
			<NodeDisplay />
		</div>
	);
}
