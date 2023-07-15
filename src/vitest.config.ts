import {defineConfig, mergeConfig} from 'vitest/config';
import viteConfig from '../vite.config';

export default mergeConfig(
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	viteConfig,
	defineConfig({
		test: {
			globals: true,
			environment: 'jsdom',
			setupFiles: ['./setup-vitest.ts'],
		},
	}),
);
