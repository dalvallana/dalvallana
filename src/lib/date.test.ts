import { describe, expect, it } from 'vitest'

import { formatDate } from '@/lib/date'

describe('formatDate', () => {
	it('formats per locale', () => {
		expect(formatDate('2026-03-05', 'en')).toBe('March 5, 2026')
		expect(formatDate('2026-03-05', 'es')).toBe('5 de marzo de 2026')
	})

	it('does not shift the day across time zones', () => {
		expect(formatDate('2026-01-01', 'en')).toBe('January 1, 2026')
	})
})
