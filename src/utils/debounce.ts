/* eslint-disable @typescript-eslint/ban-types */

// https://stackoverflow.com/a/59104900
// TODO: Test
/** Simple debounce implementation */
export function debounce<Params extends any[], Return>(
	func: (...args: Params) => Return,
	msTimeout = 250,
) {
	let timer: NodeJS.Timeout;

	return function (this: any, ...args: Params) {
		clearTimeout(timer);

		timer = setTimeout(() => {
			func.apply(this, args);
		}, msTimeout);
	};
}

/** Call `f` at most once per frame */
export function throttleToFrame<P extends any[], R>(f: (...args: P) => R) {
	let token: number | null = null;
	let lastArgs: P | null = null;

	const invoke = () => {
		if (lastArgs) {
			f(...lastArgs);
		}

		token = null;
	};

	const result = (...args: P) => {
		lastArgs = args;
		if (!token) {
			token = requestAnimationFrame(invoke);
		}
	};

	result.cancel = () => {
		if (token) {
			cancelAnimationFrame(token);
		}
	};

	return result;
}
