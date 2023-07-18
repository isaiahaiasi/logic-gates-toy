import {useLayoutEffect, useRef, useState} from 'react';

export const useClientRect = <T extends Element>() => {
	const clientRef = useRef<T>(null);
	const [clientRect, setClientRect] = useState<DOMRect>(new DOMRect(0, 0, 0, 0));

	useLayoutEffect(() => {
		if (!clientRef.current) {
			return;
		}

		setClientRect(clientRef.current.getBoundingClientRect());
	}, []);

	return {
		clientRect,
		clientRef,
	};
};
