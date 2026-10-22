import { describe, expect, it } from 'vitest'

import { defaultLocale, isLocale, localeParam, localizePath, parseLocale } from '@/lib/i18n'

describe('parseLocale', () => {
	it('defaults to English when the locale segment is missing', () => {
		expect(parseLocale()).toBe('en')
	})

	it('accepts supported locales', () => {
		expect(parseLocale('es')).toBe('es')
		expect(parseLocale('en')).toBe('en')
	})

	it('rejects unknown locales', () => {
		expect(parseLocale('xx')).toBeNull()
		expect(parseLocale('')).toBeNull()
		expect(parseLocale('posts')).toBeNull()
	})
})

describe('isLocale', () => {
	it('narrows supported locales only', () => {
		expect(isLocale('es')).toBe(true)
		expect(isLocale('fr')).toBe(false)
		expect(isLocale(null)).toBe(false)
	})
})

describe('localeParam', () => {
	it('omits the default locale from URLs', () => {
		expect(localeParam(defaultLocale)).toBeUndefined()
	})

	it('keeps other locales in URLs', () => {
		expect(localeParam('es')).toBe('es')
	})
})

describe('localizePath', () => {
	it('leaves default-locale paths unprefixed', () => {
		expect(localizePath('en', '/')).toBe('/')
		expect(localizePath('en', '/posts/x')).toBe('/posts/x')
	})

	it('prefixes other locales without a trailing slash on the home page', () => {
		expect(localizePath('es', '/')).toBe('/es')
		expect(localizePath('es', '/posts/x')).toBe('/es/posts/x')
	})
})
