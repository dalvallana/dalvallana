import { defineCollection, defineConfig } from '@content-collections/core'
import { z } from 'zod'

import { isLocale } from './src/lib/i18n'

// Metadata only: MDX bodies are compiled by Vite (see src/content/mdx.ts), because
// @content-collections/mdx evaluates code with `new Function`, which Workers forbid.
const posts = defineCollection({
	name: 'posts',
	typeName: 'Post',
	directory: 'content/posts',
	include: '**/*.mdx',
	parser: 'frontmatter-only',
	schema: z.object({
		title: z.string().min(1),
		description: z.string().min(1),
		date: z.iso.date(),
		draft: z.boolean().default(false),
		tags: z.array(z.string()).default([]),
	}),
	transform: ({ _meta, ...frontmatter }) => {
		const [locale, ...rest] = _meta.path.split('/')
		if (!isLocale(locale) || rest.length !== 1) {
			throw new Error(`Posts must live at content/posts/<locale>/<slug>.mdx, got ${_meta.filePath}`)
		}
		return { ...frontmatter, locale, slug: rest[0], filePath: _meta.filePath }
	},
})

export default defineConfig({ content: [posts] })
