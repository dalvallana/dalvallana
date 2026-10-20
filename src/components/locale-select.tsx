import { useNavigate } from '@tanstack/react-router'
import { cn } from 'cn'
import { Check, ChevronDown } from 'lucide-react'
import { Button, ListBox, ListBoxItem, Popover, Select, SelectValue } from 'react-aria-components'

import { buttonVariants } from '@/components/ui/button'
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
			<Button className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1.5')}>
				{/* Just the name: by default the trigger repeats the whole option, check mark included. */}
				<SelectValue>{({ selectedText }) => selectedText}</SelectValue>
				<ChevronDown aria-hidden className="text-muted-foreground" />
			</Button>
			<Popover
				placement="bottom end"
				className="min-w-(--trigger-width) rounded-lg border bg-popover p-1 text-popover-foreground shadow-md outline-none data-entering:animate-in data-entering:fade-in-0 data-exiting:animate-out data-exiting:fade-out-0"
			>
				<ListBox className="outline-none">
					{locales.map((option) => (
						<ListBoxItem
							key={option}
							id={option}
							lang={option}
							textValue={messages[option].localeName}
							className="flex cursor-default items-center justify-between gap-4 rounded-md px-2 py-1.5 text-sm outline-none data-focused:bg-accent data-focused:text-accent-foreground"
						>
							{({ isSelected }) => (
								<>
									{messages[option].localeName}
									<Check aria-hidden className={cn('size-4', !isSelected && 'invisible')} />
								</>
							)}
						</ListBoxItem>
					))}
				</ListBox>
			</Popover>
		</Select>
	)
}
