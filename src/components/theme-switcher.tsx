import { ThemeToggle } from '@/components/theme-toggle'
import { type Locale } from '@/lib/i18n'
import { messages } from '@/lib/messages'
import { getTheme, persistTheme } from '@/lib/theme-env'

/** Connects the toggle to the theme cookie; kept apart so the toggle's browser test avoids server imports. */
export function ThemeSwitcher({ locale }: { locale: Locale }) {
	return <ThemeToggle readTheme={getTheme} label={messages[locale].toggleTheme} onThemeChange={persistTheme} />
}
