import { describe, expect, it } from 'vitest'

import { buildCovers } from '@/content/covers'

describe('buildCovers', () => {
	it('groups widths per image, smallest first in srcSet, widest as src', () => {
		const covers = buildCovers({
			'/src/assets/covers/farm-1536.webp': '/assets/farm-1536.abc.webp',
			'/src/assets/covers/farm-768.webp': '/assets/farm-768.def.webp',
			'/src/assets/covers/sea-day-800.webp': '/assets/sea-day-800.ghi.webp',
		})
		expect(covers.get('farm')).toEqual({
			src: '/assets/farm-1536.abc.webp',
			srcSet: '/assets/farm-768.def.webp 768w, /assets/farm-1536.abc.webp 1536w',
		})
		expect(covers.get('sea-day')?.srcSet).toBe('/assets/sea-day-800.ghi.webp 800w')
	})

	it('ignores files without a width suffix', () => {
		expect(buildCovers({ '/src/assets/covers/farm.webp': '/assets/farm.webp' }).size).toBe(0)
	})
})
