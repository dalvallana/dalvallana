import { defaultLocale, type Locale, locales } from '@/lib/i18n'

export type PostMeta = {
	locale: Locale
	slug: string
	title: string
	description: string
	date: string
	draft: boolean
	tags: string[]
	filePath: string
}

/** `translations` lists every locale the post exists in, for hreflang. */
export type PostResult = { post: PostMeta; fallback: boolean; translations: Locale[] }

type SelectOptions = { includeDrafts: boolean }

export function selectPosts(posts: readonly PostMeta[], locale: Locale, { includeDrafts }: SelectOptions) {
	const visible = posts.filter((post) => post.locale === locale && (includeDrafts || !post.draft))
	return visible.toSorted((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug))
}

export function selectPost(
	posts: readonly PostMeta[],
	locale: Locale,
	slug: string,
	{ includeDrafts }: SelectOptions,
): PostResult | null {
	const matches = (post: PostMeta, inLocale: Locale) =>
		post.locale === inLocale && post.slug === slug && (includeDrafts || !post.draft)

	const translations = locales.filter((inLocale) => posts.some((post) => matches(post, inLocale)))

	const exact = posts.find((post) => matches(post, locale))
	if (exact) return { post: exact, fallback: false, translations }
	if (locale === defaultLocale) return null

	const fallback = posts.find((post) => matches(post, defaultLocale))
	return fallback ? { post: fallback, fallback: true, translations } : null
}
