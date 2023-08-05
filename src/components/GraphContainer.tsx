import {NodeDisplay} from './NodeDisplay';
import {GraphInputReceiver} from './GraphInputReceiver';
import {SvgGraph} from './svg/SvgGraph';
import {SvgGraphEdges} from './svg/SvgGraphEdges';
import {SvgMouseLinePreview} from './svg/SvgMouseLinePreview';
import {useClientRect} from '../hooks/useClientRect';
import {useUiStore} from '../state_management/uiStore';
import {useEffect} from 'react';

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
	// Update the clientRect for the graph container in the UI Store.
	const setClientRect = useUiStore(state => state.setClientRect);
	const {clientRef} = useClientRect<HTMLDivElement>(setClientRect);

	const setDragModeModifierHeld = useUiStore(state => state.setDragModeModifierHeld);

	const handleMoveModifierKeypress = (e: KeyboardEvent) => {
		// TODO: HACK: Drag Modifier should be part of UI Configuration, not hard-coded!!!
		if (e.key !== 'Shift') {
			return;
		}

		if (e.type === 'keydown') {
			setDragModeModifierHeld(true);
		} else if (e.type === 'keyup') {
			setDragModeModifierHeld(false);
		}
	};

	// Listen for keydown/keyup to turn "move tool" on/off.
	useEffect(() => {
		document.addEventListener('keydown', handleMoveModifierKeypress);
		document.addEventListener('keyup', handleMoveModifierKeypress);
		return () => {
			document.removeEventListener('keydown', handleMoveModifierKeypress);
			document.removeEventListener('keyup', handleMoveModifierKeypress);
		};
	}, [setDragModeModifierHeld]);

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
