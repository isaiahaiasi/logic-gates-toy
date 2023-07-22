/* eslint-disable @typescript-eslint/ban-types */
import {useRef, useState, useEffect, useCallback} from 'react';
import {throttleToFrame as throttle} from '../utils/debounce';
import {type Vec2} from '../flowchart/graph';

// From https://stackoverflow.com/a/39192992

// "Identity" function to serve as default.
const vecId = (x: Vec2) => x;

type DraggableParams = Partial<{
	onDrag: (v: Vec2) => Vec2;
	handlePositioning: boolean;
	initialPosition: Vec2;
	onDragStart: () => void;
	onDragEnd: () => void;
	modifier: 'altKey' | 'ctrlKey' | 'metaKey';
}>;

export const useDraggable = ({
	onDrag = vecId,
	handlePositioning = false,
	initialPosition = {x: 0, y: 0},
	onDragStart = () => undefined,
	onDragEnd = () => undefined,
	modifier,
}: DraggableParams = {}) => {
	const [pressed, setPressed] = useState(false);

	// Position kept in ref because even with throttling it's too laggy.
	const position = useRef(initialPosition);
	const ref = useRef<HTMLElement | null>();

	// We've moved the code into the hook, and it would be weird to
	// return `ref` and `handleMouseDown` to be set on the same element
	// why not just do the job on our own here and use a function-ref
	// to subscribe to `mousedown` too? it would go like this:

	const unsubscribe = useRef<(() => void) | null>(null);

	const legacyRef = useCallback((elem: HTMLElement | null) => {
		// In a production version of this code I'd use a
		// `useComposeRef` hook to compose function-ref and object-ref
		// into one ref, and then would return it. combining
		// hooks in this way by hand is error-prone

		// then I'd also split out the rest of this function into a
		// separate hook to be called like this:
		// const legacyRef = useDomEvent('mousedown');
		// const combinedRef = useCombinedRef(ref, legacyRef);
		// return [combinedRef, pressed];
		ref.current = elem;
		if (unsubscribe.current) {
			unsubscribe.current();
		}

		if (!elem) {
			return;
		}

		const handleMouseDown = (e: MouseEvent) => {
			// If modifier key is required, only continue if it's actually pressed.
			if (modifier && !e[modifier]) {
				return;
			}

			if (e.target instanceof HTMLElement) {
				onDragStart();
				setPressed(true);
			}
		};

		elem.addEventListener('mousedown', handleMouseDown);
		unsubscribe.current = () => {
			elem.removeEventListener('mousedown', handleMouseDown);
		};
	}, []);

	useEffect(() => {
		// Why subscribe in a `useEffect`? because we want to subscribe
		// to mousemove only when pressed, otherwise it will lag even
		// when you're not dragging
		if (!pressed) {
			return;
		}

		// Be aware that naive requestAnimationFrame implementation can make element
		// lag 1 frame behind cursor, even if it's running at 60 FPS.
		const handleMouseMove = throttle((event: MouseEvent) => {
			if (!ref.current || !position.current) {
				return;
			}

			const pos = position.current;

			// It's important to save it into variable here,
			// otherwise we might capture reference to an element
			// that was long gone. not really sure what's correct
			// behavior for a case when you've been scrolling, and
			// the target element was replaced. probably some formulae
			// needed to handle that case. TODO
			const elem = ref.current;
			position.current = onDrag({
				x: pos.x + event.movementX,
				y: pos.y + event.movementY,
			});

			if (handlePositioning) {
				elem.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
			}
		});

		const handleMouseUp = (e: MouseEvent) => {
			if (e.target instanceof HTMLElement) {
				onDragEnd();
				setPressed(false);
			}
		};

		// Subscribe to mousemove and mouseup on document, otherwise you
		// can escape bounds of element while dragging and get stuck
		// dragging it forever
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);

		return () => {
			handleMouseMove.cancel();
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};

		// If `onDrag` wasn't defined with `useCallback`, we'd have to
		// resubscribe to 2 DOM events here, not to say it would mess
		// with `throttle` and reset its internal timer
	}, [pressed, onDrag]);

	return [legacyRef, pressed] as const;
};
