import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { nextTheme, type Theme } from '@/lib/theme'

const labels: Record<Theme, string> = { light: 'Light', dark: 'Dark', system: 'System' }

type ThemeToggleProps = {
	initialTheme: Theme
	onThemeChange: (theme: Theme) => void
}

export function ThemeToggle({ initialTheme, onThemeChange }: ThemeToggleProps) {
	const [theme, setTheme] = useState(initialTheme)

	function handlePress() {
		const next = nextTheme(theme)
		setTheme(next)
		onThemeChange(next)
	}

	return (
		<Button variant="ghost" size="sm" onPress={handlePress}>
			Theme: {labels[theme]}
		</Button>
	)
}
