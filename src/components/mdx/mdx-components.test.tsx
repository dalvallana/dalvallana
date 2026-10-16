import { expect, test } from 'vitest'
import { render } from 'vitest-browser-react'

import Fixture from '@/components/mdx/fixture.mdx'
import { mdxComponents } from '@/components/mdx/mdx-components'

test('MDX content renders the shared components', async () => {
	const screen = await render(<Fixture components={mdxComponents} />)

	await expect.element(screen.getByRole('note')).toHaveTextContent('Callout text')
	await screen.getByRole('button', { name: 'Increment' }).click()
	await expect.element(screen.getByText('Count: 1')).toBeVisible()
})
