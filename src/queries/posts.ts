import { queryOptions } from '@tanstack/react-query'

import { getPost, getPosts } from '@/content/posts'
import type { Locale } from '@/lib/i18n'

export const postsQueryOptions = (locale: Locale) =>
	queryOptions({ queryKey: ['posts', locale], queryFn: () => getPosts({ data: { locale } }) })

export const postQueryOptions = (locale: Locale, slug: string) =>
	queryOptions({ queryKey: ['post', locale, slug], queryFn: () => getPost({ data: { locale, slug } }) })
