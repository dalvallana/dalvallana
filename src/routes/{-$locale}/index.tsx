import { createFileRoute, Link } from '@tanstack/react-router'

import { localeParam } from '@/lib/i18n'
import { messages } from '@/lib/messages'
import { siteName } from '@/lib/site'

export const Route = createFileRoute('/{-$locale}/')({ component: Home })

function Home() {
	const { locale } = Route.useRouteContext()
	const t = messages[locale]
	return (
		<section>
			<h1 className="text-3xl font-semibold tracking-tight">{siteName}</h1>
			<p className="mt-4 text-muted-foreground">{t.tagline}</p>
			<Link to="/{-$locale}/posts" params={{ locale: localeParam(locale) }} className="mt-8 inline-block underline">
				{t.allPosts}
			</Link>
		</section>
	)
}
