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

test('the language dropdown switches the current page to another locale', async ({ page }) => {
	await page.goto('/posts/hello-world')
	await page.getByRole('button', { name: /Language/ }).click()
	await page.getByRole('option', { name: 'Español' }).click()
	await expect(page).toHaveURL('/es/posts/hello-world')
	await expect(page.getByRole('heading', { level: 1, name: 'Hola, mundo' })).toBeVisible()

	await page.getByRole('button', { name: /Idioma/ }).click()
	await page.getByRole('option', { name: 'English' }).click()
	await expect(page).toHaveURL('/posts/hello-world')
})

test('pages declare their translations to search engines', async ({ page }) => {
	const hreflangs = async (path: string) => {
		await page.goto(path)
		return page
			.locator('link[rel="alternate"][hreflang]')
			.evaluateAll((links) =>
				links.map((link) => `${link.getAttribute('hreflang')} ${new URL(link.getAttribute('href') ?? '').pathname}`),
			)
	}

	expect(await hreflangs('/')).toEqual(['en /', 'es /es', 'x-default /'])
	expect(await hreflangs('/es/posts/hello-world')).toEqual([
		'en /posts/hello-world',
		'es /es/posts/hello-world',
		'x-default /posts/hello-world',
	])
	// English-only posts have no alternates, and their Spanish fallback defers to the English URL.
	expect(await hreflangs('/posts/quiet-tools')).toEqual([])
	await page.goto('/es/posts/only-in-english')
	const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
	expect(new URL(canonical ?? '').pathname).toBe('/posts/only-in-english')
})

test('a missing translation falls back to English with a notice', async ({ page }) => {
	await page.goto('/es/posts/only-in-english')
	await expect(page.getByRole('heading', { level: 1, name: 'Only in English' })).toBeVisible()
	await expect(page.getByText('aún no está disponible en español')).toBeVisible()
	await expect(page.locator('article')).toHaveAttribute('lang', 'en')
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

	const toggle = page.getByRole('button', { name: 'Toggle dark mode' })
	await toggle.click() // system (light in the test browser) → dark
	await expect(html).toHaveAttribute('data-theme', 'dark')

	// Prerendered page: the inline script applies the cookie before paint.
	await page.reload()
	await expect(html).toHaveAttribute('data-theme', 'dark')

	// System is only the default: from here the toggle flips between the two explicit choices.
	await toggle.click()
	await expect(html).toHaveAttribute('data-theme', 'light')
	await toggle.click()
	await expect(html).toHaveAttribute('data-theme', 'dark')

	// SSR page: the server reads the cookie itself.
	const response = await page.request.get('/posts/does-not-exist')
	expect(await response.text()).toContain('data-theme="dark"')
})

test.describe('without JavaScript', () => {
	test.use({ javaScriptEnabled: false })

	test('post bodies are part of the served HTML', async ({ page }) => {
		await page.goto('/posts/hello-world')
		await expect(page.getByText('This note is a React component rendered from MDX.')).toBeVisible()
	})
})

test('default-locale prefixed URLs redirect to unprefixed ones', async ({ page }) => {
	await page.goto('/en/posts/hello-world')
	await expect(page).toHaveURL('/posts/hello-world')
	await expect(page.getByRole('heading', { level: 1, name: 'Hello, world' })).toBeVisible()

	const response = await page.request.get('/en', { maxRedirects: 0 })
	expect(response.status()).toBe(301)
	expect(response.headers().location).toMatch(/^(?:http:\/\/127\.0\.0\.1:4173)?\/$/)
})
