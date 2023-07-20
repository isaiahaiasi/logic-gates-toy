import './App.css';
import {DebugInfo} from './components/DebugInfo';
import {GraphContainer} from './components/GraphContainer';
import {NodeSelector} from './components/NodeSelector';

function App() {
	return (
		<div style={{width: '50rem', maxWidth: '100%'}}>
			<h1>Test Graph</h1>
			<div style={{display: 'flex'}}>
				<NodeSelector />
				<GraphContainer />
			</div>
			<DebugInfo />
		</div>
	);
}

export default App;
