import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'

import { localeParam } from '@/lib/i18n'
import { messages } from '@/lib/messages'
import { postsQueryOptions } from '@/queries/posts'

export const Route = createFileRoute('/{-$locale}/posts/')({
	loader: async ({ context: { queryClient, locale } }) => {
		await queryClient.query({ ...postsQueryOptions(locale), staleTime: 'static' })
	},
	component: PostsPage,
})

function PostsPage() {
	const { locale } = Route.useRouteContext()
	const { data: posts } = useSuspenseQuery(postsQueryOptions(locale))
	return (
		<section>
			<h1 className="text-3xl font-semibold tracking-tight">{messages[locale].posts}</h1>
			<ul className="mt-8 space-y-6">
				{posts.map((post) => (
					<li key={post.slug}>
						<Link
							to="/{-$locale}/posts/$slug"
							params={{ locale: localeParam(locale), slug: post.slug }}
							className="text-lg font-medium hover:underline"
						>
							{post.title}
						</Link>
						<p className="mt-1 text-sm text-muted-foreground">{post.description}</p>
					</li>
				))}
			</ul>
		</section>
	)
}
