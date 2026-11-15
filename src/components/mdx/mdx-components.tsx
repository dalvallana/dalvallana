import type { MDXComponents } from 'mdx/types'

import { Callout } from '@/components/mdx/callout'
import { Counter } from '@/components/mdx/counter'
import { YouTube } from '@/components/mdx/youtube'
import { TextAnchor } from '@/components/text-link'

/** Components available to every post without importing them. */
export const mdxComponents = { a: TextAnchor, Callout, Counter, YouTube } satisfies MDXComponents
