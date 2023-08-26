export interface Vec2 {
	x: number;
	y: number;
}

type V2BinaryOperatorFunction = (v1: Vec2 | number, v2: Vec2 | number) => Vec2;

function narrow(n: Vec2 | number): Vec2 {
	return typeof n === 'number' ? {x: n, y: n} : n;
}

export const v2Math: Record<string, V2BinaryOperatorFunction> = {
	add(v1, v2) {
		v1 = narrow(v1);
		v2 = narrow(v2);

		return {
			x: v1.x + v2.x,
			y: v1.y + v2.y,
		};
	},
	subtract(v1, v2) {
		v1 = narrow(v1);
		v2 = narrow(v2);

		return {
			x: v1.x - v2.x,
			y: v1.y - v2.y,
		};
	},
	multiply(v1, v2) {
		v1 = narrow(v1);
		v2 = narrow(v2);

		return {
			x: v1.x * v2.x,
			y: v1.y * v2.y,
		};
	},
	divide(v1, v2) {
		v1 = narrow(v1);
		v2 = narrow(v2);

		return {
			x: v1.x / v2.x,
			y: v1.y / v2.y,
		};
	},
};
