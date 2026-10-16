import { ClientOnly } from '@tanstack/react-router'

import { ThemeToggle } from '@/components/theme-toggle'
import { getTheme, persistTheme } from '@/lib/theme-env'

/** Rendered only in the browser: prerendered HTML cannot know the visitor's cookie, so the label would mismatch. */
export function ThemeSwitcher() {
	return (
		<ClientOnly fallback={<span className="inline-block h-8 w-28" />}>
			<ConnectedThemeToggle />
		</ClientOnly>
	)
}

function ConnectedThemeToggle() {
	return <ThemeToggle initialTheme={getTheme()} onThemeChange={persistTheme} />
}
