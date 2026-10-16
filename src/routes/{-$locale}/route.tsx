import { createFileRoute, notFound, Outlet } from '@tanstack/react-router'

import { SiteHeader } from '@/components/site-header'
import { parseLocale } from '@/lib/i18n'

export const Route = createFileRoute('/{-$locale}')({
	beforeLoad: ({ params }) => {
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
