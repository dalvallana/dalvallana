import { createLink } from '@tanstack/react-router'
import { cn } from 'cn'
import type { ComponentProps } from 'react'

/** An accent-colored link for running text; consumers add or override classes through `className`. */
export function TextAnchor({ className, children, ...props }: ComponentProps<'a'>) {
	return (
		<a
			className={cn(
				// no-underline beats prose's always-on underline, which only applies at :where() specificity.
				'font-medium text-highlight no-underline underline-offset-4 transition-colors hover:text-highlight-hover hover:underline',
				className,
			)}
			{...props}
		>
			{children}
		</a>
	)
}

/** `TextAnchor` with TanStack Router's typed `to`/`params` for in-app links. */
export const TextLink = createLink(TextAnchor)
