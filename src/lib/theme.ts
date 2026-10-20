import { z } from 'zod'

export const themes = ['light', 'dark', 'system'] as const
export type Theme = (typeof themes)[number]
export const themeCookieName = 'theme'

const themeSchema = z.enum(themes)

export function parseTheme(value: unknown): Theme {
	const result = themeSchema.safeParse(value)
	return result.success ? result.data : 'system'
}

/** The toggle flips what is on screen; `system` is only the default and is never chosen again. */
export function nextTheme(theme: Theme, prefersDark: boolean): Theme {
	const isDark = theme === 'dark' || (theme === 'system' && prefersDark)
	return isDark ? 'light' : 'dark'
}

export function readThemeCookie(cookies: string): Theme {
	const match = new RegExp(`(?:^|;\\s*)${themeCookieName}=([^;]*)`).exec(cookies)
	return parseTheme(match?.[1])
}

/**
 * Runs before first paint. Prerendered pages are built without a cookie, so this applies the
 * visitor's saved theme; on SSR pages it re-applies what the server already rendered.
 */
export const themeScript = `document.documentElement.dataset.theme=(document.cookie.match(/(?:^|;\\s*)${themeCookieName}=(light|dark|system)/)||[])[1]||'system'`
