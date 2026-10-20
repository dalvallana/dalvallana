import type { ErrorComponentProps } from '@tanstack/react-router'

export function ErrorPage({ error }: ErrorComponentProps) {
	return (
		<main className="mx-auto flex max-w-2xl flex-col gap-4 px-6 py-16">
			<h1 className="text-2xl font-semibold">Something went wrong</h1>
			{import.meta.env.DEV ? (
				<pre className="overflow-auto text-sm text-muted-foreground">
					{error instanceof Error ? error.message : String(error)}
				</pre>
			) : null}
		</main>
	)
}
