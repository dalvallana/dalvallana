import { useNavigate } from '@tanstack/react-router'

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { isLocale, type Locale, localeParam, locales } from '@/lib/i18n'
import { messages } from '@/lib/messages'

/** Switches the current page to another locale; each option is named in its own language. */
export function LocaleSelect({ locale }: { locale: Locale }) {
	const navigate = useNavigate()

	function handleChange(key: unknown) {
		if (!isLocale(key) || key === locale) return
		void navigate({ to: '.', params: (prev) => ({ ...prev, locale: localeParam(key) }), search: true })
	}

	return (
		<Select aria-label={messages[locale].language} value={locale} onChange={handleChange}>
			{/* Ghost-styled like the theme toggle; the translucent hover stays visible over the hero photo. */}
			<SelectTrigger
				size="sm"
				className="border-transparent bg-transparent font-medium hover:bg-foreground/10 dark:bg-transparent dark:hover:bg-foreground/10"
			>
				{/* Just the name: by default the trigger repeats the whole option, check mark included. */}
				<SelectValue>{({ selectedText }) => selectedText}</SelectValue>
			</SelectTrigger>
			<SelectContent placement="bottom end">
				{/* The group carries the popover's padding. */}
				<SelectGroup>
					{locales.map((option) => (
						<SelectItem key={option} id={option} lang={option}>
							{messages[option].localeName}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}
