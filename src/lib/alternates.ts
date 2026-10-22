import { defaultLocale, type Locale, locales, localizePath } from '@/lib/i18n'
import { siteUrl } from '@/lib/site'

const absoluteUrl = (locale: Locale, path: string) => new URL(localizePath(locale, path), siteUrl).href

/**
 * hreflang links telling search engines which URL serves each language of a page, so searchers land on their own.
 * `path` has no locale prefix. Nothing is emitted for single-language pages; x-default is the default locale.
 */
export function alternateLinks(path: string, available: readonly Locale[] = locales) {
	if (available.length < 2) return []
	const links: { rel: string; hrefLang: string; href: string }[] = available.map((locale) => ({
		rel: 'alternate',
		hrefLang: locale,
		href: absoluteUrl(locale, path),
	}))
	if (available.includes(defaultLocale)) {
		links.push({ rel: 'alternate', hrefLang: 'x-default', href: absoluteUrl(defaultLocale, path) })
	}
	return links
}

/** Points search engines at the URL that should be indexed for this content. */
export function canonicalLink(locale: Locale, path: string) {
	return { rel: 'canonical', href: absoluteUrl(locale, path) }
}
