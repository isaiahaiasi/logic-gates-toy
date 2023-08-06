// eslint-disable-next-line @typescript-eslint/naming-convention
export function mapObject<V, VR>(
	obj: Record<string, V>,
	mapFn: (entry: [k: string, v: V]) => [string, VR],
): Record<string, VR> {
	return Object.fromEntries(Object.entries<V>(obj)
		.map(mapFn));
}

export function arrayFromUnique<T>(size: number, fn: () => T) {
	return Array.from(Array(size), fn);
}
