import { createFileRoute, notFound, Outlet, redirect } from '@tanstack/react-router'

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
	return (
		<>
			<SiteHeader locale={locale} />
			<main className="mx-auto max-w-2xl px-6 pt-6 pb-16">
				<Outlet />
			</main>
		</>
	)
}
