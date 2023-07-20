import {createContext} from 'react';

export interface GraphSvgContextType {
	rect: DOMRect;
}

const defaultContext = {
	rect: new DOMRect(0, 0, 0, 0),
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const GraphSvgContext = createContext<GraphSvgContextType>(defaultContext);
