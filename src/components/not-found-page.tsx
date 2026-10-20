import { Link, useParams } from '@tanstack/react-router'

import { defaultLocale, localeParam, parseLocale } from '@/lib/i18n'
import { messages } from '@/lib/messages'

export function NotFoundPage() {
	const { locale: param } = useParams({ strict: false })
	const locale = parseLocale(param) ?? defaultLocale
	const t = messages[locale]
	return (
		<main className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-16">
			<div className="flex flex-col gap-2">
				<h1 className="text-2xl font-semibold">{t.notFoundTitle}</h1>
				<p className="text-muted-foreground">{t.notFoundBody}</p>
			</div>
			<Link to="/{-$locale}" params={{ locale: localeParam(locale) }} className="self-start underline">
				{t.goHome}
			</Link>
		</main>
	)
}
