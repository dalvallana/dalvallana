import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { PageTitle } from '@/components/page-title'
import { TextLink } from '@/components/text-link'
import { alternateLinks } from '@/lib/alternates'
import { localeParam } from '@/lib/i18n'
import { messages } from '@/lib/messages'
import { postsQueryOptions } from '@/queries/posts'

export const Route = createFileRoute('/{-$locale}/posts/')({
	loader: async ({ context: { queryClient, locale } }) => {
		await queryClient.query(postsQueryOptions(locale))
	},
	head: () => ({ links: alternateLinks('/posts') }),
	component: PostsPage,
})

function PostsPage() {
	const { locale } = Route.useRouteContext()
	const { data: posts } = useSuspenseQuery(postsQueryOptions(locale))
	return (
		<section className="flex flex-col gap-8">
			<PageTitle>{messages[locale].posts}</PageTitle>
			<ul className="flex flex-col gap-6">
				{posts.map((post) => (
					<li key={post.slug} className="flex flex-col gap-1">
						<TextLink
							to="/{-$locale}/posts/$slug"
							params={{ locale: localeParam(locale), slug: post.slug }}
							className="self-start text-lg"
						>
							{post.title}
						</TextLink>
						<p className="text-sm text-muted-foreground">{post.description}</p>
					</li>
				))}
			</ul>
		</section>
	)
}
