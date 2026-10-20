import { Link } from '@tanstack/react-router'
import { cn } from 'cn'

import { ThemeSwitcher } from '@/components/theme-switcher'
import { type Locale, localeParam } from '@/lib/i18n'
import { messages } from '@/lib/messages'
import { siteName } from '@/lib/site'

type SiteHeaderProps = {
	locale: Locale
	/** Floats over the home hero, whose veil keeps the theme's text colors legible on the photo. */
	overlay?: boolean
}

export function SiteHeader({ locale, overlay = false }: SiteHeaderProps) {
	const params = { locale: localeParam(locale) }
	return (
		<header className={cn(overlay && 'absolute inset-x-0 top-0 z-10')}>
			<div className={cn('mx-auto flex items-center justify-between px-6 py-6', overlay ? 'max-w-6xl' : 'max-w-2xl')}>
				<Link to="/{-$locale}" params={params} className="font-heading text-xl">
					{siteName}
				</Link>
				<nav className="flex items-center gap-4 text-sm">
					<Link to="/{-$locale}/posts" params={params}>
						{messages[locale].posts}
					</Link>
					<ThemeSwitcher locale={locale} />
				</nav>
			</div>
		</header>
	)
}
