import { cn } from 'cn'
import type { ReactNode } from 'react'

/** The h1 of section pages like Posts and Resume, so they share one style. */
export function PageTitle({ className, children }: { className?: string; children: ReactNode }) {
	return (
		// leading-tight leaves room for descenders, which the text-clipped gradient would otherwise cut off.
		<h1 className={cn('text-eyebrow-gradient text-4xl leading-tight font-semibold sm:text-5xl', className)}>
			{children}
		</h1>
	)
}
