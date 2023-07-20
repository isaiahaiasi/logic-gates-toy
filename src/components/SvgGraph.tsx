import {useMemo, type PropsWithChildren} from 'react';
import {useClientRect} from '../hooks/useClientRect';
import {GraphSvgContext, type GraphSvgContextType} from '../state_management/clientRectContext';

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
	const {clientRef, clientRect} = useClientRect<SVGSVGElement>();
	const svgContextData: GraphSvgContextType = useMemo(
		() => ({rect: clientRect}),
		[clientRect],
	);

	return (
		<div style={containerStyle}>
			<GraphSvgContext.Provider value={svgContextData}>
				<svg
					width='100%'
					height='100%'
					stroke='black'
					ref={clientRef}
				>
					{children}
				</svg>
			</GraphSvgContext.Provider>
		</div>
	);
}
