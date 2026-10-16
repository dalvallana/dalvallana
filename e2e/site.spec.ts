import { expect, test } from '@playwright/test'

test('home links to the posts list and on to an interactive post', async ({ page }) => {
	await page.goto('/')
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

	await page.getByRole('link', { name: 'Posts', exact: true }).click()
	await expect(page).toHaveURL('/posts')

	await page.getByRole('link', { name: 'Hello, world' }).click()
	await expect(page.getByRole('heading', { level: 1, name: 'Hello, world' })).toBeVisible()
	await expect(page.getByRole('note')).toHaveText('This note is a React component rendered from MDX.')

	await page.getByRole('button', { name: 'Increment' }).click()
	await expect(page.getByText('Count: 1')).toBeVisible()
})

test('Spanish URLs serve Spanish content', async ({ page }) => {
	await page.goto('/es/posts/hello-world')
	await expect(page.locator('html')).toHaveAttribute('lang', 'es')
	await expect(page.getByRole('heading', { level: 1, name: 'Hola, mundo' })).toBeVisible()
})

test('a missing translation falls back to English with a notice', async ({ page }) => {
	await page.goto('/es/posts/only-in-english')
	await expect(page.getByRole('heading', { level: 1, name: 'Only in English' })).toBeVisible()
	await expect(page.getByText('aún no está disponible en español')).toBeVisible()
})

test('unknown posts and locales respond with 404', async ({ page }) => {
	const missingPost = await page.goto('/posts/does-not-exist')
	expect(missingPost?.status()).toBe(404)
	await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()

	const unknownLocale = await page.goto('/xx')
	expect(unknownLocale?.status()).toBe(404)
})

test('the chosen theme persists and the server renders it', async ({ page }) => {
	await page.goto('/')
	const html = page.locator('html')
	await expect(html).toHaveAttribute('data-theme', 'system')

	const toggle = page.getByRole('button', { name: /^Theme:/ })
	await toggle.click() // system → light
	await toggle.click() // light → dark
	await expect(html).toHaveAttribute('data-theme', 'dark')

	// Prerendered page: the inline script applies the cookie before paint.
	await page.reload()
	await expect(html).toHaveAttribute('data-theme', 'dark')
	await expect(toggle).toHaveText('Theme: Dark')

	// SSR page: the server reads the cookie itself.
	const response = await page.request.get('/posts/does-not-exist')
	expect(await response.text()).toContain('data-theme="dark"')
})
