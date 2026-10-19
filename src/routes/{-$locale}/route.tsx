import { createFileRoute, notFound, Outlet, redirect, useMatch } from '@tanstack/react-router'

import { SiteHeader } from '@/components/site-header'
import { defaultLocale, parseLocale } from '@/lib/i18n'

export const Route = createFileRoute('/{-$locale}')({
	beforeLoad: ({ params, location }) => {
		// The default locale lives at unprefixed URLs; `/en/...` would duplicate them.
		if (params.locale === defaultLocale) {
			const pathname = location.pathname.slice(`/${defaultLocale}`.length) || '/'
			const hash = location.hash ? `#${location.hash}` : ''
			throw redirect({ href: `${pathname}${location.searchStr}${hash}`, statusCode: 301 })
		}
		// `{-$locale}` also matches arbitrary first segments like `/anything`.
		const locale = parseLocale(params.locale)
		if (!locale) throw notFound()
		return { locale }
	},
	component: LocaleLayout,
})

function LocaleLayout() {
	const { locale } = Route.useRouteContext()
	// The home page is full-bleed: its hero runs under the header and it lays out its own sections.
	const isHome = useMatch({ from: '/{-$locale}/', shouldThrow: false }) !== undefined
	return (
		<>
			<SiteHeader locale={locale} overlay={isHome} />
			<main className={isHome ? undefined : 'mx-auto max-w-2xl px-6 pt-6 pb-16'}>
				<Outlet />
			</main>
		</>
	)
}
