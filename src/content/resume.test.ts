import { describe, expect, it } from 'vitest'

import { yearsSince } from '@/content/resume'

describe('yearsSince', () => {
	it('counts whole calendar years', () => {
		expect(yearsSince(2010, new Date('2026-10-22'))).toBe(16)
	})

	it('changes on New Year’s Day in UTC', () => {
		expect(yearsSince(2010, new Date('2026-12-31T23:59:59Z'))).toBe(16)
		expect(yearsSince(2010, new Date('2027-01-01T00:00:00Z'))).toBe(17)
	})
})
