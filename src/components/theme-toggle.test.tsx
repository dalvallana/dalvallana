import { expect, test, vi } from 'vitest'
import { render } from 'vitest-browser-react'

import { ThemeToggle } from '@/components/theme-toggle'
import type { Theme } from '@/lib/theme'

test('flips between light and dark and reports each choice', async () => {
	let theme: Theme = 'light'
	const onThemeChange = vi.fn<(theme: Theme) => void>((next) => {
		theme = next
	})
	const screen = await render(
		<ThemeToggle readTheme={() => theme} label="Toggle theme" onThemeChange={onThemeChange} />,
	)
	const button = screen.getByRole('button', { name: 'Toggle theme' })

	await button.click()
	await button.click()

	expect(onThemeChange.mock.calls).toEqual([['dark'], ['light']])
})

test('leaves system for the opposite of the OS scheme', async () => {
	const onThemeChange = vi.fn<(theme: Theme) => void>()
	const screen = await render(
		<ThemeToggle readTheme={() => 'system'} label="Toggle theme" onThemeChange={onThemeChange} />,
	)

	await screen.getByRole('button').click()

	const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches
	expect(onThemeChange).toHaveBeenCalledExactlyOnceWith(prefersDark ? 'light' : 'dark')
})
