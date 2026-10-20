import { MoonStar, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { nextTheme, type Theme } from '@/lib/theme'

type ThemeToggleProps = {
	/** Read on press, so the saved choice is the only source of truth. */
	readTheme: () => Theme
	label: string
	onThemeChange: (theme: Theme) => void
}

/** The icons follow `data-theme` through the `dark:` variant, so the markup never depends on the cookie. */
export function ThemeToggle({ readTheme, label, onThemeChange }: ThemeToggleProps) {
	function handlePress() {
		onThemeChange(nextTheme(readTheme(), matchMedia('(prefers-color-scheme: dark)').matches))
	}

	return (
		<Button variant="ghost" size="icon" aria-label={label} onPress={handlePress} className="relative cursor-pointer">
			<Sun className="size-5 scale-100 rotate-0 transition-transform duration-300 motion-reduce:transition-none dark:scale-0 dark:-rotate-90" />
			<MoonStar className="absolute size-5 scale-0 rotate-90 transition-transform duration-300 motion-reduce:transition-none dark:scale-100 dark:rotate-0" />
		</Button>
	)
}
