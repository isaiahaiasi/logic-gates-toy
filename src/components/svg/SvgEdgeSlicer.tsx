import {useContext} from 'react';
import {useMouseMove} from '../../hooks/useMouseMove';
import {useUiStore} from '../../state_management/uiStore';
import {GraphSvgContext} from '../../state_management/clientRectContext';

export function SvgEdgeSlicer() {
	// NOTE: Might be a good idea to move the line itself out of VDOM.
	// So it's not bound by react's render loop, which can be laggy.
	const mousePos = useMouseMove();

	const {rect} = useContext(GraphSvgContext);
	const currentAction = useUiStore(state => state.currentAction);
	const initialPos = useUiStore(state => state.edgeSliceStart);

	if (currentAction === 'REMOVING_EDGE' && !initialPos) {
		throw new Error('Invalid UI State in SvgEdgeSlicer: REMOVING_EDGE without edgeSliceStart!');
	}

	return currentAction === 'REMOVING_EDGE' ? (
		<line
			x1={initialPos!.x}
			y1={initialPos!.y}
			x2={mousePos.x - rect.x}
			y2={mousePos.y - rect.y}
			strokeWidth={2}
			stroke={'red'}
		/>
	) : null;
}
