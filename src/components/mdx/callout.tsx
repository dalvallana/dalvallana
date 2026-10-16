import type { ReactNode } from 'react'

export function Callout({ children }: { children: ReactNode }) {
	return (
		<aside role="note" className="not-prose my-6 rounded-lg border bg-muted px-4 py-3 text-sm">
			{children}
		</aside>
	)
}
