import './App.css';
import {GraphContainer} from './components/GraphContainer';
import {NodeSelector} from './components/NodeSelector';
import {UiStateInfo} from './components/UiStateInfo';
import {type NodeTemplate} from './state_management/uiStore';

const nodeTemplates: NodeTemplate[] = [
	{
		label: 'AND',
		templateFn: info => ({
			id: `AND:${Date.now()}`,
			position: info.spawnPosition,
			size: {x: 5, y: 3},
			data: {
				label: `A:${Math.round(info.spawnPosition.x * 100)}|${Math.round(info.spawnPosition.y * 100)}`,
			},
		}),
	},
	{
		label: 'NOT',
		templateFn: info => ({
			id: `NOT:${Date.now()}`,
			position: info.spawnPosition,
			size: {x: 4, y: 2},
			data: {
				label: `N:${Math.round(info.spawnPosition.x * 100)}|${Math.round(info.spawnPosition.y * 100)}`,
			},
		}),
	},
	{
		label: 'OR',
		templateFn: info => ({
			id: `OR:${Date.now()}`,
			position: info.spawnPosition,
			size: 4,
			data: {
				label: `O:${Math.round(info.spawnPosition.x * 100)}|${Math.round(info.spawnPosition.y * 100)}`,
			},
		}),
	},
];

function App() {
	return (
		<div style={{width: '50rem', maxWidth: '100%'}}>
			<h1>Test Graph</h1>
			<div style={{display: 'flex'}}>
				<NodeSelector nodeTemplates={nodeTemplates} />
				<GraphContainer />
			</div>
			<UiStateInfo />
		</div>
	);
}

export default App;
