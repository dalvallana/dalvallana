import contentCollections from '@content-collections/vite'
import mdx from '@mdx-js/rollup'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import remarkFrontmatter from 'remark-frontmatter'
import { defineConfig } from 'vite'

export default defineConfig({
	server: { port: 3000 },
	resolve: { tsconfigPaths: true },
	plugins: [
		// Frontmatter is read by content-collections; here it is only stripped from the body.
		{ enforce: 'pre', ...mdx({ remarkPlugins: [remarkFrontmatter] }) },
		tailwindcss(),
		contentCollections(),
		tanstackStart({
			// Locale roots and indexes are listed explicitly; individual posts are found by crawling their links.
			prerender: { enabled: true, crawlLinks: true, failOnError: true },
			pages: [{ path: '/' }, { path: '/es' }, { path: '/posts' }, { path: '/es/posts' }],
		}),
		viteReact({ include: /\.(mdx|js|jsx|ts|tsx)$/ }),
	],
})
