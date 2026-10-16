import type { Plugin } from 'vite'

import { isDraftMdx } from '../src/content/drafts.ts'

/** In production builds, empties draft post sources before MDX compiles them so no draft text reaches any chunk. */
export function excludeDrafts(): Plugin {
	return {
		name: 'exclude-drafts',
		apply: 'build',
		enforce: 'pre',
		transform(code, id) {
			const [path = ''] = id.split('?')
			if (!/\/content\/posts\/.+\.mdx$/.test(path) || !isDraftMdx(code)) return null
			return { code: '', map: null }
		},
	}
}
