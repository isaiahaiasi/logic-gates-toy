// Simple debounce implementation:
// https://stackoverflow.com/a/59104900
// TODO: Test
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
