import {type PropsWithChildren} from 'react';

const containerStyle: React.CSSProperties = {
	position: 'absolute',
	inset: 0,
	userSelect: 'none',
	pointerEvents: 'none',
};

/** SVG part of the graph renderer.
 * Should receive the individual components (eg, SvgEdges) as children.
 */
export function SvgGraph({children}: PropsWithChildren) {
	return (
		<div style={containerStyle}>
			<svg
				width='100%'
				height='100%'
				stroke='black'
			>
				{children}
			</svg>
		</div>
	);
}
