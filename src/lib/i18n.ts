export const locales = ['en', 'es'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export function isLocale(value: unknown): value is Locale {
	return locales.some((locale) => locale === value)
}

/** Maps the optional `{-$locale}` URL segment to a locale; `null` means the segment is not a locale. */
export function parseLocale(param?: string): Locale | null {
	if (param === undefined) return defaultLocale
	return isLocale(param) ? param : null
}

/** The value for the `{-$locale}` segment when linking: the default locale has no prefix. */
export function localeParam(locale: Locale): Locale | undefined {
	return locale === defaultLocale ? undefined : locale
}

/** The URL of `path` (written without a locale prefix, like `/posts/x`) in `locale`. */
export function localizePath(locale: Locale, path: string): string {
	if (locale === defaultLocale) return path
	return path === '/' ? `/${locale}` : `/${locale}${path}`
}
