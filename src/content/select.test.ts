import { describe, expect, it } from 'vitest'

import { type PostMeta, selectPost, selectPosts } from '@/content/select'

function post(overrides: Partial<PostMeta>): PostMeta {
	return {
		locale: 'en',
		slug: 'hello',
		title: 'Hello',
		description: 'Desc',
		date: '2026-01-01',
		draft: false,
		tags: [],
		filePath: 'en/hello.mdx',
		...overrides,
	}
}

const posts: PostMeta[] = [
	post({ slug: 'old', date: '2026-01-01', filePath: 'en/old.mdx' }),
	post({ slug: 'new', date: '2026-03-01', filePath: 'en/new.mdx' }),
	post({ slug: 'wip', date: '2026-04-01', draft: true, filePath: 'en/wip.mdx' }),
	post({ locale: 'es', slug: 'old', date: '2026-01-01', filePath: 'es/old.mdx' }),
]

describe('selectPosts', () => {
	it('returns published posts for the locale, newest first', () => {
		expect(selectPosts(posts, 'en', { includeDrafts: false }).map((p) => p.slug)).toEqual(['new', 'old'])
		expect(selectPosts(posts, 'es', { includeDrafts: false }).map((p) => p.filePath)).toEqual(['es/old.mdx'])
	})

	it('orders posts with the same date by slug', () => {
		const sameDay = [post({ slug: 'b' }), post({ slug: 'c' }), post({ slug: 'a' })]
		expect(selectPosts(sameDay, 'en', { includeDrafts: false }).map((p) => p.slug)).toEqual(['a', 'b', 'c'])
	})

	it('includes drafts when asked', () => {
		expect(selectPosts(posts, 'en', { includeDrafts: true }).map((p) => p.slug)).toEqual(['wip', 'new', 'old'])
	})
})

describe('selectPost', () => {
	it('finds the post in the requested locale', () => {
		expect(selectPost(posts, 'es', 'old', { includeDrafts: false })).toEqual({
			post: posts[3],
			fallback: false,
			translations: ['en', 'es'],
		})
	})

	it('falls back to the default locale when no translation exists', () => {
		expect(selectPost(posts, 'es', 'new', { includeDrafts: false })).toEqual({
			post: posts[1],
			fallback: true,
			translations: ['en'],
		})
	})

	it('returns null for unknown slugs', () => {
		expect(selectPost(posts, 'en', 'missing', { includeDrafts: false })).toBeNull()
		expect(selectPost(posts, 'es', 'missing', { includeDrafts: false })).toBeNull()
	})

	it('hides drafts unless asked', () => {
		expect(selectPost(posts, 'en', 'wip', { includeDrafts: false })).toBeNull()
		expect(selectPost(posts, 'en', 'wip', { includeDrafts: true })?.post).toBe(posts[2])
	})
})
