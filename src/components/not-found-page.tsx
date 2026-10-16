import { Link, useParams } from '@tanstack/react-router'

import { defaultLocale, localeParam, parseLocale } from '@/lib/i18n'
import { messages } from '@/lib/messages'

export function NotFoundPage() {
	const { locale: param } = useParams({ strict: false })
	const locale = parseLocale(param) ?? defaultLocale
	const t = messages[locale]
	return (
		<main className="mx-auto max-w-2xl px-6 py-16">
			<h1 className="text-2xl font-semibold">{t.notFoundTitle}</h1>
			<p className="mt-2 text-muted-foreground">{t.notFoundBody}</p>
			<Link to="/{-$locale}" params={{ locale: localeParam(locale) }} className="mt-6 inline-block underline">
				{t.goHome}
			</Link>
		</main>
	)
}
