import type { ErrorComponentProps } from '@tanstack/react-router'

export function ErrorPage({ error }: ErrorComponentProps) {
	return (
		<main className="mx-auto max-w-2xl px-6 py-16">
			<h1 className="text-2xl font-semibold">Something went wrong</h1>
			{import.meta.env.DEV ? (
				<pre className="mt-4 overflow-auto text-sm text-muted-foreground">
					{error instanceof Error ? error.message : String(error)}
				</pre>
			) : null}
		</main>
	)
}
