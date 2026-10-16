import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { allPosts } from 'content-collections'
import { z } from 'zod'

import { selectPost, selectPosts } from '@/content/select'
import { locales } from '@/lib/i18n'

const includeDrafts = import.meta.env.DEV
const localeSchema = z.enum(locales)

export const getPosts = createServerFn({ method: 'GET' })
	.validator(z.object({ locale: localeSchema }))
	.handler(({ data }) => selectPosts(allPosts, data.locale, { includeDrafts }))

export const getPost = createServerFn({ method: 'GET' })
	.validator(z.object({ locale: localeSchema, slug: z.string().min(1) }))
	.handler(({ data }) => {
		const result = selectPost(allPosts, data.locale, data.slug, { includeDrafts })
		if (!result) throw notFound()
		return result
	})
