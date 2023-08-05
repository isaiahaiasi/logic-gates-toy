import {type Vec2} from '../flowchart/Vec2';
import {type Node} from '../flowchart/graph';
import {type NodeTemplate} from '../state_management/uiStore';

// Templates/definitions used to construct Graph Node entities.

function getChildId(parentId: string, childName: string) {
	return `${parentId}::${childName}`;
}

function getPinNode(id: string, pin: string, position: Vec2): Node {
	return {
		id: getChildId(id, pin),
		position,
		size: {x: 16, y: 16},
		data: {label: ''},
		parent: id,
		lockPosition: true,
	};
}

export const andTemplate: NodeTemplate = {
	label: 'AND',
	templateFn(info) {
		const id = `AND:${Date.now()}`;
		return [
			{
				id,
				position: info.spawnPosition,
				size: {x: 80, y: 48},
				lockExtension: true,
				data: {
					label: 'AND',
				},
				children: [
					getChildId(id, 'IN0'),
					getChildId(id, 'IN1'),
					getChildId(id, 'OUT'),
				],
			},
			getPinNode(id, 'IN0', {x: 0, y: 0}),
			getPinNode(id, 'IN1', {x: 0, y: 1}),
			getPinNode(id, 'OUT', {x: 1, y: 0.5}),
		];
	},
};

export const notTemplate: NodeTemplate = {
	label: 'NOT',
	templateFn(info) {
		const id = `NOT:${Date.now()}`;
		return [
			{
				id,
				position: info.spawnPosition,
				size: {x: 64, y: 32},
				lockExtension: true,
				data: {
					label: 'NOT',
				},
				children: [
					getChildId(id, 'IN'),
					getChildId(id, 'OUT'),
				],
			},
			getPinNode(id, 'IN', {x: 0, y: 0.5}),
			getPinNode(id, 'OUT', {x: 1, y: 0.5}),
		];
	},
};

export const orTemplate: NodeTemplate = {
	label: 'OR',
	templateFn(info) {
		const id = `OR:${Date.now()}`;
		return [
			{
				id,
				position: info.spawnPosition,
				size: {x: 80, y: 48},
				lockExtension: true,
				data: {
					label: 'OR',
				},
				children: [
					getChildId(id, 'IN0'),
					getChildId(id, 'IN1'),
					getChildId(id, 'OUT'),
				],
			},
			getPinNode(id, 'IN0', {x: 0, y: 0}),
			getPinNode(id, 'IN1', {x: 0, y: 1}),
			getPinNode(id, 'OUT', {x: 1, y: 0.5}),
		];
	},
};

export const gateTemplates = [
	andTemplate,
	orTemplate,
	notTemplate,
];
