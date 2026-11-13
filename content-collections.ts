import { defineCollection, defineConfig } from '@content-collections/core'
import { z } from 'zod'

import { readingMinutes } from './src/content/reading-time'
import { isLocale } from './src/lib/i18n'

// Metadata only: MDX bodies are compiled by Vite (see src/content/mdx.ts), because
// @content-collections/mdx evaluates code with `new Function`, which Workers forbid. The body is read here only to
// time it and then dropped, so no post text (draft or not) ends up in the metadata.
const posts = defineCollection({
	name: 'posts',
	typeName: 'Post',
	directory: 'content/posts',
	include: '**/*.mdx',
	parser: 'frontmatter',
	schema: z.object({
		title: z.string().min(1),
		description: z.string().min(1),
		date: z.iso.date(),
		draft: z.boolean().default(false),
		tags: z.array(z.string()).default([]),
		/** `image` names a set of files in src/assets/covers (`<image>-<width>.webp`), shared by every translation. */
		cover: z.object({ image: z.string().min(1), alt: z.string().min(1) }).optional(),
		/** The MDX body, filled in by the parser; the transform only times it. */
		content: z.string(),
	}),
	transform: ({ _meta, content, ...frontmatter }) => {
		const [locale, ...rest] = _meta.path.split('/')
		if (!isLocale(locale) || rest.length !== 1) {
			throw new Error(`Posts must live at content/posts/<locale>/<slug>.mdx, got ${_meta.filePath}`)
		}
		return { ...frontmatter, locale, slug: rest[0], filePath: _meta.filePath, readingTime: readingMinutes(content) }
	},
})

export default defineConfig({ content: [posts] })
