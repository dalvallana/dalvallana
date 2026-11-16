import { expect, test } from 'vitest'
import { render } from 'vitest-browser-react'

import Fixture from '@/components/mdx/fixture.mdx'
import { mdxComponents } from '@/components/mdx/mdx-components'

test('MDX content renders the shared components', async () => {
	const screen = await render(<Fixture components={mdxComponents} />)

	await expect.element(screen.getByRole('note')).toHaveTextContent('Callout text')
	await screen.getByRole('button', { name: 'Increment' }).click()
	await expect.element(screen.getByText('Count: 1')).toBeVisible()
	await expect
		.element(screen.getByTitle('Fixture video'))
		.toHaveAttribute('src', 'https://www.youtube-nocookie.com/embed/fixture-id')
	await expect
		.element(screen.getByRole('img', { name: 'Fixture photo' }))
		.toHaveAttribute(
			'srcset',
			'/src/assets/photos/netherlands-campus-768.webp 768w, /src/assets/photos/netherlands-campus-1536.webp 1536w',
		)
})
