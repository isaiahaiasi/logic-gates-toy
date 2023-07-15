import {useUiStore} from '../state_management/uiStore';

export function UiStateInfo() {
	const heldNodeTemplate = useUiStore(state => state.heldNodeTemplate);
	return (
		<div>Holding: {heldNodeTemplate?.label ?? 'None'}</div>
	);
}
