import mdx from '@mdx-js/rollup'
import viteReact from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import remarkFrontmatter from 'remark-frontmatter'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [
		{ enforce: 'pre', ...mdx({ remarkPlugins: [remarkFrontmatter] }) },
		viteReact({ include: /\.(mdx|js|jsx|ts|tsx)$/ }),
	],
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
