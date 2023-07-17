import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {type NodeTemplate} from '../../state_management/uiStore';
import {GraphNodeListItem} from '../../components/GraphNodeListItem';

const nodeTemplate: NodeTemplate = {
	label: 'AND TEMPLATE LABEL',
	templateFn: info => ({
		id: `AND:${Date.now()}`,
		position: info.spawnPosition,
		data: {
			label: `A:${Math.round(info.spawnPosition.x * 100)}|${Math.round(info.spawnPosition.y * 100)}`,
		},
	}),
};

const renderNodeListItem = () => render(<GraphNodeListItem template={nodeTemplate} />);

describe('NodeSelector', () => {
	test('should render successfully', async () => {
		renderNodeListItem();

		expect(await screen.findByText(nodeTemplate.label));

		expect(
			await screen.findByRole(
				'button', {name: `select node ${nodeTemplate.label}`}),
		).toBeInTheDocument();
	});

	test('"toggled" state of button should be represented by `aria-pressed` attribute', async () => {
		const user = userEvent.setup();

		renderNodeListItem();

		expect(await screen.findByRole('button', {name: `select node ${nodeTemplate.label}`, pressed: false})).toBeInTheDocument();

		await user.click(await screen.findByRole('button'));

		expect(await screen.findByRole('button', {name: `select node ${nodeTemplate.label}`, pressed: true})).toBeInTheDocument();

		await user.click(await screen.findByRole('button'));

		expect(await screen.findByRole('button', {name: `select node ${nodeTemplate.label}`, pressed: false})).toBeInTheDocument();
	});
});

