import {useUiStore} from '../../state_management/uiStore';

export function UiStateInfo() {
	const heldNodeTemplate = useUiStore(state => state.heldNodeTemplate);
	const sourceNode = useUiStore(state => state.sourceNode);
	const currentAction = useUiStore(state => state.currentAction);

	let subDescription: string | undefined;

	switch (currentAction) {
		case 'ADDING_NODE':
			subDescription = `Holding: ${heldNodeTemplate?.label ?? 'None'}`;
			break;
		case 'ADDING_EDGE':
			subDescription = `Edge: ${sourceNode ?? 'None'} → ???`;
			break;
		default:
			subDescription = undefined;
	}

	return (
		<div>
			<div>Current Action: {currentAction}</div>
			{subDescription && <div>{subDescription}</div>}
		</div>
	);
}
