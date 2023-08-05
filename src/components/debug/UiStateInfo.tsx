import {useUiStore} from '../../state_management/uiStore';

export function UiStateInfo() {
	const heldNodeTemplate = useUiStore.use.heldNodeTemplate?.();
	const sourceNode = useUiStore.use.sourceNode?.();
	const edgeSliceStart = useUiStore.use.edgeSliceStart?.();
	const currentAction = useUiStore.use.currentAction();

	let subDescription: string | undefined;

	switch (currentAction) {
		case 'ADDING_NODE':
			subDescription = `Holding: ${heldNodeTemplate?.label ?? 'None'}`;
			break;
		case 'ADDING_EDGE':
			subDescription = `Edge: ${sourceNode ?? 'None'} → ???`;
			break;
		case 'REMOVING_EDGE':
			subDescription = `Slicing edges from (${edgeSliceStart?.x ?? '?'}, ${edgeSliceStart?.y ?? '?'})`;
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
