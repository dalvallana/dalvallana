import type { Locale } from '@/lib/i18n'

/** Formats a `YYYY-MM-DD` date in UTC, so server and browser agree regardless of their time zones. */
export function formatDate(date: string, locale: Locale) {
	return new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(date))
}
