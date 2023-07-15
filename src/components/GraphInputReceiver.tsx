import {type Vec2} from '../flowchart/graph';
import {useGraphStore} from '../flowchart/graphStore';
import {useUiStore} from '../state_management/uiStore';

// TODO: Figure out how I want to handle styling.
const style: React.CSSProperties = {
	position: 'absolute',
	inset: 0,
};

function getPosition(
	mouseX: number,
	mouseY: number,
	boundingClientRect: DOMRect,
): Vec2 {
	const {top, left, width, height} = boundingClientRect;
	return {
		x: (mouseX - left) / width,
		y: (mouseY - top) / height,
	};
}

export function GraphInputReceiver() {
	const heldNodeTemplate = useUiStore(state => state.heldNodeTemplate);
	const addNode = useGraphStore(state => state.addNode);

	const handleClick: React.EventHandler<React.MouseEvent> = e => {
		if (!heldNodeTemplate) {
			return;
		}

		const spawnPosition = getPosition(
			e.clientX,
			e.clientY,
			e.currentTarget.getBoundingClientRect(),
		);

		addNode(heldNodeTemplate.templateFn({spawnPosition}));
	};

	return (
		<div style={style} onClick={handleClick} />
	);
}
