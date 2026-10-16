import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, HeadContent, ScriptOnce, Scripts } from '@tanstack/react-router'
import type { ReactNode } from 'react'

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
})

function RootDocument({ children }: { children: ReactNode }) {
	const { theme } = Route.useRouteContext()
	return (
		// The inline script may change data-theme before hydration on prerendered pages.
		<html lang="en" data-theme={theme} suppressHydrationWarning>
			<head>
				<ScriptOnce>{themeScript}</ScriptOnce>
				<HeadContent />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	)
}
