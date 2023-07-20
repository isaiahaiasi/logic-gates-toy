import {useEffect, useState} from 'react';

export function useMouseMove() {
	const [mousePos, setMousePos] = useState({x: 0, y: 0});

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setMousePos({x: e.clientX, y: e.clientY});
		};

		addEventListener('mousemove', handleMouseMove);

		return () => {
			removeEventListener(
				'mousemove',
				handleMouseMove,
			);
		};
	}, []);

	return mousePos;
}
