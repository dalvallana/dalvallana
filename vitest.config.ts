import viteReact from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [viteReact()],
	resolve: { tsconfigPaths: true },
	test: {
		projects: [
			{
				extends: true,
				test: { name: 'unit', environment: 'node', include: ['src/**/*.test.ts'] },
			},
			{
				extends: true,
				test: {
					name: 'browser',
					include: ['src/**/*.test.tsx'],
					browser: { enabled: true, provider: playwright(), instances: [{ browser: 'chromium' }] },
				},
			},
		],
	},
})
