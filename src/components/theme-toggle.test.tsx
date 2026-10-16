import { expect, test, vi } from 'vitest'
import { render } from 'vitest-browser-react'

import { ThemeToggle } from '@/components/theme-toggle'
import type { Theme } from '@/lib/theme'

test('cycles through themes and reports each choice', async () => {
	const onThemeChange = vi.fn<(theme: Theme) => void>()
	const screen = await render(<ThemeToggle initialTheme="light" onThemeChange={onThemeChange} />)
	const button = screen.getByRole('button')

	await expect.element(button).toHaveTextContent('Theme: Light')
	await button.click()
	await expect.element(button).toHaveTextContent('Theme: Dark')
	await button.click()
	await expect.element(button).toHaveTextContent('Theme: System')

	expect(onThemeChange.mock.calls).toEqual([['dark'], ['system']])
})
