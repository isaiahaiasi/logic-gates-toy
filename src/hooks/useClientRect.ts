import {useLayoutEffect, useRef, useState} from 'react';
import {debounce} from '../utils/debounce';

// Hook to get BoundingClientRect.
// Recalculates based on window resize to prevent stale DOMRect causing alignment issues.
// (Does *not* listen for other resize events!)
// Uses a simple debounce utility function to prevent excessive re-rendering.
export const useClientRect = <T extends Element>() => {
	const clientRef = useRef<T>(null);
	const [clientRect, setClientRect] = useState<DOMRect>(new DOMRect(0, 0, 0, 0));

	useLayoutEffect(() => {
		const debouncedSetClientRect = debounce(() => {
			if (!clientRef.current) {
				return;
			}

			setClientRect(clientRef.current.getBoundingClientRect());
		});

		debouncedSetClientRect();
		window.addEventListener('resize', debouncedSetClientRect);

		return () => {
			window.removeEventListener('resize', debouncedSetClientRect);
		};
	}, []);

	return {
		clientRect,
		clientRef,
	};
};
