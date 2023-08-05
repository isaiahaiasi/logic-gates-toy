import {useLayoutEffect, useRef, useState} from 'react';
import {debounce} from '../utils/debounce';

// Hook to get BoundingClientRect.
// Recalculates based on window resize to prevent stale DOMRect causing alignment issues.
// (Does *not* listen for other resize events!)
// Uses a simple debounce utility function to prevent excessive re-rendering.

/** @param onChange Invoked when clientRect changes, to easily keep external store in sync. */
export const useClientRect = <T extends Element>(onChange: (r: DOMRect) => void) => {
	const clientRef = useRef<T>(null);
	const [clientRect, setClientRect] = useState<DOMRect>(new DOMRect(0, 0, 0, 0));

	useLayoutEffect(() => {
		const debouncedSetClientRect = debounce(() => {
			if (!clientRef.current) {
				return;
			}

			const newRect = clientRef.current.getBoundingClientRect();
			setClientRect(newRect);
			onChange(newRect);
		});

		debouncedSetClientRect();
		window.addEventListener('resize', debouncedSetClientRect);

		return () => {
			window.removeEventListener('resize', debouncedSetClientRect);
		};
	}, [clientRef, setClientRect]);

	return {
		clientRect,
		clientRef,
	};
};
