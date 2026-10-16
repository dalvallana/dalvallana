import { describe, expect, it } from 'vitest'

import { nextTheme, parseTheme, readThemeCookie } from '@/lib/theme'

describe('parseTheme', () => {
	it('accepts known themes', () => {
		expect(parseTheme('light')).toBe('light')
		expect(parseTheme('dark')).toBe('dark')
		expect(parseTheme('system')).toBe('system')
	})

	it('falls back to system for anything else', () => {
		expect(parseTheme(null)).toBe('system')
		expect(parseTheme('sepia')).toBe('system')
	})
})

describe('nextTheme', () => {
	it('cycles light → dark → system → light', () => {
		expect(nextTheme('light')).toBe('dark')
		expect(nextTheme('dark')).toBe('system')
		expect(nextTheme('system')).toBe('light')
	})
})

describe('readThemeCookie', () => {
	it('finds the theme among other cookies', () => {
		expect(readThemeCookie('a=1; theme=dark; b=2')).toBe('dark')
		expect(readThemeCookie('theme=light')).toBe('light')
	})

	it('ignores cookies that only end with "theme"', () => {
		expect(readThemeCookie('colortheme=dark')).toBe('system')
	})

	it('defaults to system when missing or invalid', () => {
		expect(readThemeCookie('')).toBe('system')
		expect(readThemeCookie('theme=neon')).toBe('system')
	})
})
