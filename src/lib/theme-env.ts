import { createIsomorphicFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'

import { parseTheme, readThemeCookie, type Theme, themeCookieName } from '@/lib/theme'

/** The visitor's theme: from the request cookie on the server, from `document.cookie` in the browser. */
export const getTheme = createIsomorphicFn()
	.server((): Theme => parseTheme(getCookie(themeCookieName)))
	.client((): Theme => readThemeCookie(document.cookie))

/** Saves the choice for future requests and applies it immediately. Browser only. */
export function persistTheme(theme: Theme) {
	document.cookie = `${themeCookieName}=${theme}; path=/; max-age=31536000; samesite=lax`
	document.documentElement.dataset.theme = theme
}
