import {useEffect} from 'react';

export function useKeyEvent(
	eventType: 'keydown' | 'keyup', // 'keypress' is deprecated.
	key: string,
	cb: () => void,
) {
	// NOTE: May want to make listener optionally targeted.
	// NOTE: However, EventTarget element must be focusable.

	const handleKeyEvent = (e: KeyboardEvent) => {
		if (e.key !== key || e.type !== eventType) {
			return;
		}

		cb();
	};

	useEffect(() => {
		document.addEventListener(eventType, handleKeyEvent);

		return () => {
			document.removeEventListener(eventType, handleKeyEvent);
		};
	}, []);
}
