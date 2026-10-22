import { useParams } from '@tanstack/react-router'

import { PageTitle } from '@/components/page-title'
import { SiteHeader } from '@/components/site-header'
import { TextLink } from '@/components/text-link'
import { defaultLocale, localeParam, parseLocale } from '@/lib/i18n'
import { messages } from '@/lib/messages'

export function NotFoundPage() {
	const { locale: param } = useParams({ strict: false })
	const locale = parseLocale(param) ?? defaultLocale
	const t = messages[locale]
	// The root route renders this outside the locale layout, so it brings its own header.
	return (
		<>
			<SiteHeader locale={locale} />
			<main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 pt-6 pb-16">
				<div className="flex flex-col gap-4">
					<PageTitle>{t.notFoundTitle}</PageTitle>
					<p className="text-muted-foreground">{t.notFoundBody}</p>
				</div>
				<TextLink to="/{-$locale}" params={{ locale: localeParam(locale) }} className="self-start">
					{t.goHome}
				</TextLink>
			</main>
		</>
	)
}
