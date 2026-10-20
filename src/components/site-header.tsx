import { Link } from '@tanstack/react-router'
import { cn } from 'cn'

import { LocaleSelect } from '@/components/locale-select'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { type Locale, localeParam } from '@/lib/i18n'
import { messages } from '@/lib/messages'
import { siteName } from '@/lib/site'

type SiteHeaderProps = {
	locale: Locale
	/** Floats over the home hero instead of taking space above the content. */
	overlay?: boolean
}

export function SiteHeader({ locale, overlay = false }: SiteHeaderProps) {
	const params = { locale: localeParam(locale) }
	return (
		// Pinned on every page; sticky keeps the header's own space in the flow, so content needs no offset.
		<header
			className={cn('top-0 z-20 bg-background/10 shadow-md backdrop-blur-sm', overlay ? 'fixed inset-x-0' : 'sticky')}
		>
			<div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
				<Link to="/{-$locale}" params={params} className="font-heading text-xl">
					{siteName}
				</Link>
				<nav className="flex items-center gap-4 text-sm">
					<Link to="/{-$locale}/posts" params={params} className="underline-offset-4 hover:underline">
						{messages[locale].posts}
					</Link>
					<div className="flex items-center gap-1">
						<LocaleSelect locale={locale} />
						<ThemeSwitcher locale={locale} />
					</div>
				</nav>
			</div>
		</header>
	)
}
