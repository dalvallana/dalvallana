import { describe, expect, it } from 'vitest'

import { alternateLinks, canonicalLink } from '@/lib/alternates'
import { siteUrl } from '@/lib/site'

describe('alternateLinks', () => {
	it('lists every locale plus x-default with absolute URLs', () => {
		expect(alternateLinks('/posts/x')).toEqual([
			{ rel: 'alternate', hrefLang: 'en', href: `${siteUrl}/posts/x` },
			{ rel: 'alternate', hrefLang: 'es', href: `${siteUrl}/es/posts/x` },
			{ rel: 'alternate', hrefLang: 'x-default', href: `${siteUrl}/posts/x` },
		])
	})

	it('emits nothing for a page in a single language', () => {
		expect(alternateLinks('/posts/x', ['en'])).toEqual([])
	})
})

describe('canonicalLink', () => {
	it('points at the locale that owns the content', () => {
		expect(canonicalLink('en', '/posts/x')).toEqual({ rel: 'canonical', href: `${siteUrl}/posts/x` })
	})
})
