import {type NodeTemplate, useUiStore} from '../state_management/uiStore';

interface GraphNodeListItemProps {
	template: NodeTemplate;
}

export function GraphNodeListItem({template}: GraphNodeListItemProps) {
	const pickUpNode = useUiStore(state => state.pickUpNodeTemplate);
	const dropNode = useUiStore(state => state.dropNodeTemplate);
	const currentlyHeldNode = useUiStore(state => state.heldNodeTemplate);

	const handleClick = () => {
		// NOTE: Might need a better way to identify "sameness"...
		// (Or at least use a name that clearly implies uniqueness!)
		if (currentlyHeldNode?.label === template.label) {
			dropNode();
		} else {
			pickUpNode(template);
		}
	};

	return (
		<div className='node-template-item' onClick={handleClick}>
			{template.label}
		</div>
	);
}
