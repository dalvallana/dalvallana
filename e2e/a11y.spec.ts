import { AxeBuilder } from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const paths = ['/', '/posts', '/posts/hello-world', '/es', '/es/posts/hello-world', '/posts/does-not-exist']
const themes = ['light', 'dark'] as const

for (const theme of themes) {
	for (const path of paths) {
		test(`${path} has no serious accessibility violations in ${theme} mode`, async ({ page, context, baseURL }) => {
			await context.addCookies([{ name: 'theme', value: theme, url: baseURL ?? 'http://localhost:4173' }])
			await page.goto(path)

			const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
			const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')

			expect(serious.map((v) => `${v.id}: ${v.help}`)).toEqual([])
		})
	}
}
