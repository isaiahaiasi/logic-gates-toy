import './App.css';
import {GraphContainer} from './components/GraphContainer';
import {NodeSelector} from './components/NodeSelector';
import {UiStateInfo} from './components/UiStateInfo';
import {type NodeTemplate} from './state_management/uiStore';

const nodeTemplates: NodeTemplate[] = [
	{
		label: 'AND',
		templateFn: info => ({
			id: 'AND' + new Date().toString(),
			position: info.spawnPosition,
			data: {
				label: `A:${Math.round(info.spawnPosition.x * 100)}|${Math.round(info.spawnPosition.y * 100)}`,
			},
		}),
	},
	{
		label: 'NOT',
		templateFn: info => ({
			id: 'NOT' + new Date().toString(),
			position: info.spawnPosition,
			data: {
				label: `N:${Math.round(info.spawnPosition.x * 100)}|${Math.round(info.spawnPosition.y * 100)}`,
			},
		}),
	},
	{
		label: 'OR',
		templateFn: info => ({
			id: 'OR' + new Date().toString(),
			position: info.spawnPosition,
			data: {
				label: `O:${Math.round(info.spawnPosition.x * 100)}|${Math.round(info.spawnPosition.y * 100)}`,
			},
		}),
	},
];

function App() {
	return (
		<>
			<h1>Test Graph</h1>
			<div style={{display: 'flex'}}>
				<NodeSelector nodeTemplates={nodeTemplates} />
				<GraphContainer />
			</div>
			<UiStateInfo />
		</>
	);
}

export default App;
