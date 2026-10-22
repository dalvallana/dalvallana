import { Link } from '@tanstack/react-router'
import { cn } from 'cn'
import { Menu } from 'lucide-react'
import { useState } from 'react'

import { LocaleSelect } from '@/components/locale-select'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { type Locale, localeParam } from '@/lib/i18n'
import { messages } from '@/lib/messages'
import { siteName } from '@/lib/site'

type SiteHeaderProps = {
	locale: Locale
	/** Floats over the home hero instead of taking space above the content. */
	overlay?: boolean
}

export function SiteHeader({ locale, overlay = false }: SiteHeaderProps) {
	return (
		// Pinned on every page; sticky keeps the header's own space in the flow, so content needs no offset.
		<header
			className={cn(
				'top-0 z-20 bg-background/10 shadow-md backdrop-blur-sm print:hidden',
				overlay ? 'fixed inset-x-0' : 'sticky',
			)}
		>
			<div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-5 sm:gap-4 sm:px-5">
				{/* The title and the controls grow equally, so the nav sits in the middle of the header. */}
				<div className="flex flex-1">
					<Link to="/{-$locale}" params={{ locale: localeParam(locale) }} className="font-heading text-xl">
						{siteName}
					</Link>
				</div>
				<nav className="hidden items-center gap-8 text-sm sm:flex">
					<NavLinks locale={locale} inactiveClassName="underline-offset-4 hover:underline" />
				</nav>
				<div className="flex flex-1 items-center justify-end gap-1 text-sm">
					<LocaleSelect locale={locale} />
					<ThemeSwitcher locale={locale} />
					<NavMenu locale={locale} />
				</div>
			</div>
		</header>
	)
}

type NavLinksProps = {
	locale: Locale
	className?: string
	/** Only the links to other sections get it, so the current one stays plain on hover. */
	inactiveClassName?: string
	onNavigate?: () => void
}

/** Shared by the inline nav and the small-screen menu; the current section is bold. */
function NavLinks({ locale, className, inactiveClassName, onNavigate }: NavLinksProps) {
	const linkProps = {
		params: { locale: localeParam(locale) },
		className,
		activeProps: { className: 'font-semibold' },
		inactiveProps: { className: inactiveClassName },
		onClick: onNavigate,
	}
	return (
		<>
			<Link to="/{-$locale}/posts" {...linkProps}>
				{messages[locale].posts}
			</Link>
			<Link to="/{-$locale}/resume" {...linkProps}>
				{messages[locale].resume}
			</Link>
		</>
	)
}

/** Replaces the inline nav below the `sm` breakpoint. */
function NavMenu({ locale }: { locale: Locale }) {
	const [isOpen, setOpen] = useState(false)

	return (
		<PopoverTrigger isOpen={isOpen} onOpenChange={setOpen}>
			<Button
				variant="ghost"
				size="icon"
				aria-label={messages[locale].menu}
				className="cursor-pointer hover:bg-foreground/10 sm:hidden dark:hover:bg-foreground/10"
			>
				<Menu className="size-5" />
			</Button>
			<Popover placement="bottom end" aria-label={messages[locale].menu} className="w-48 p-1.5">
				<nav className="flex flex-col">
					<NavLinks
						locale={locale}
						className="rounded-md px-2.5 py-2 hover:bg-muted"
						onNavigate={() => setOpen(false)}
					/>
				</nav>
			</Popover>
		</PopoverTrigger>
	)
}
