import { describe, expect, it } from 'vitest'

import { isDraftMdx } from '@/content/drafts'

describe('isDraftMdx', () => {
	it('detects `draft: true` in the frontmatter', () => {
		expect(isDraftMdx('---\ntitle: A\ndraft: true\n---\n\nBody')).toBe(true)
	})

	it('treats `draft: false` and a missing key as published', () => {
		expect(isDraftMdx('---\ntitle: A\ndraft: false\n---\n\nBody')).toBe(false)
		expect(isDraftMdx('---\ntitle: A\n---\n\nBody')).toBe(false)
	})

	it('ignores `draft: true` outside the frontmatter', () => {
		expect(isDraftMdx('---\ntitle: A\n---\n\ndraft: true\n')).toBe(false)
		expect(isDraftMdx('draft: true\n\nNo frontmatter')).toBe(false)
	})

	it('handles Windows line endings', () => {
		expect(isDraftMdx('---\r\ntitle: A\r\ndraft: true\r\n---\r\n\r\nBody')).toBe(true)
		expect(isDraftMdx('---\r\ntitle: A\r\n---\r\n\r\ndraft: true\r\n')).toBe(false)
	})
})
