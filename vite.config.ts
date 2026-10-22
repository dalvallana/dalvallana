import contentCollections from '@content-collections/vite'
import mdx from '@mdx-js/rollup'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import remarkFrontmatter from 'remark-frontmatter'
import { defineConfig } from 'vite'

import { excludeDrafts } from './vite/exclude-drafts.ts'

export default defineConfig({
	server: { port: 3000 },
	// Prerendering fetches from Vite's preview server; an explicit IPv4 host avoids `localhost`
	// resolving to `::1` while the server listens elsewhere (seen on GitHub's Ubuntu runners).
	preview: { host: '127.0.0.1' },
	resolve: { tsconfigPaths: true },
	plugins: [
		// Must precede the MDX plugin (same `pre` level, so array order decides).
		excludeDrafts(),
		// Frontmatter is read by content-collections; here it is only stripped from the body.
		{ enforce: 'pre', ...mdx({ remarkPlugins: [remarkFrontmatter] }) },
		tailwindcss(),
		contentCollections(),
		tanstackStart({
			// Locale roots and indexes are listed explicitly; individual posts are found by crawling their links.
			prerender: {
				enabled: true,
				crawlLinks: true,
				failOnError: true,
				// Crawled links to files (like the resume PDF) are already copied from public/; the prerenderer would
				// fetch them again and rewrite them as text, corrupting binaries.
				filter: ({ path }) => !/\.\w+$/.test(path),
			},
			pages: [
				{ path: '/' },
				{ path: '/es' },
				{ path: '/posts' },
				{ path: '/es/posts' },
				{ path: '/resume' },
				{ path: '/es/resume' },
			],
		}),
		viteReact({ include: /\.(mdx|js|jsx|ts|tsx)$/ }),
	],
})
