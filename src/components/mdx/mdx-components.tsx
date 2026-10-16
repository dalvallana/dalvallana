import type { MDXComponents } from 'mdx/types'

import { Callout } from '@/components/mdx/callout'
import { Counter } from '@/components/mdx/counter'

/** Components available to every post without importing them. */
export const mdxComponents = { Callout, Counter } satisfies MDXComponents
