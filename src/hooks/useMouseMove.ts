import {useEffect, useState} from 'react';

export function useMouseMove() {
	const [mousePos, setMousePos] = useState({x: 0, y: 0});

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setMousePos({x: e.clientX, y: e.clientY});
		};

		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			window.removeEventListener(
				'mousemove',
				handleMouseMove,
			);
		};
	}, []);

	return mousePos;
}
