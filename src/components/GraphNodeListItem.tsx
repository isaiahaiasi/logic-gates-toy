import {type NodeTemplate, useUiStore} from '../state_management/uiStore';

interface GraphNodeListItemProps {
	template: NodeTemplate;
}

const activeStyle: React.CSSProperties = {
	backgroundColor: '#59787e',
};

export function GraphNodeListItem({template}: GraphNodeListItemProps) {
	const pickUpNode = useUiStore.use.pickUpNodeTemplate();
	const dropNode = useUiStore.use.dropNodeTemplate();
	const currentlyHeldNode = useUiStore.use.heldNodeTemplate?.();

	// NOTE: Not sure how to SEMANTICALLY represent "currently selected" state.
	const isSelected = currentlyHeldNode?.label === template.label;

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
		<button
			className='node-template-item'
			onClick={handleClick}
			type='button'
			aria-label={`select node ${template.label}`}
			aria-pressed={isSelected}
			style={isSelected ? activeStyle : {}}
		>
			{template.label}
		</button>
	);
}
