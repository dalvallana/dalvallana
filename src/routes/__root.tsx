import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, HeadContent, ScriptOnce, Scripts, useParams } from '@tanstack/react-router'
import type { ReactNode } from 'react'

import { ErrorPage } from '@/components/error-page'
import { NotFoundPage } from '@/components/not-found-page'
import { defaultLocale, parseLocale } from '@/lib/i18n'
import { siteName } from '@/lib/site'
import { themeScript } from '@/lib/theme'
import { getTheme } from '@/lib/theme-env'

import appCss from '@/styles/app.css?url'

type RouterContext = { queryClient: QueryClient }

export const Route = createRootRouteWithContext<RouterContext>()({
	beforeLoad: () => ({ theme: getTheme() }),
	head: () => ({
		meta: [
			{ charSet: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ title: siteName },
		],
		links: [{ rel: 'stylesheet', href: appCss }],
	}),
	shellComponent: RootDocument,
	errorComponent: ErrorPage,
	notFoundComponent: NotFoundPage,
})

function RootDocument({ children }: { children: ReactNode }) {
	const { theme } = Route.useRouteContext()
	const { locale } = useParams({ strict: false })
	return (
		// The inline script may change data-theme before hydration on prerendered pages.
		<html lang={parseLocale(locale) ?? defaultLocale} data-theme={theme} suppressHydrationWarning>
			<head>
				<ScriptOnce>{themeScript}</ScriptOnce>
				<HeadContent />
			</head>
			{/* A column at least one screen tall: each page's <main> grows, so short pages still push the footer down. */}
			<body className="flex min-h-svh flex-col">
				{children}
				<Scripts />
			</body>
		</html>
	)
}
