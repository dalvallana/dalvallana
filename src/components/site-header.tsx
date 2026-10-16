import { Link } from '@tanstack/react-router'

import { ThemeSwitcher } from '@/components/theme-switcher'
import { type Locale, localeParam } from '@/lib/i18n'
import { messages } from '@/lib/messages'
import { siteName } from '@/lib/site'

export function SiteHeader({ locale }: { locale: Locale }) {
	const params = { locale: localeParam(locale) }
	return (
		<header className="mx-auto flex max-w-2xl items-center justify-between px-6 py-6">
			<Link to="/{-$locale}" params={params} className="font-semibold">
				{siteName}
			</Link>
			<nav className="flex items-center gap-4 text-sm">
				<Link to="/{-$locale}/posts" params={params}>
					{messages[locale].posts}
				</Link>
				<ThemeSwitcher />
			</nav>
		</header>
	)
}
