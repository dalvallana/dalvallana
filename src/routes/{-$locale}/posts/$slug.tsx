import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'

import { mdxComponents } from '@/components/mdx/mdx-components'
import { getPostBody, preloadPostBody } from '@/content/mdx'
import { messages } from '@/lib/messages'
import { postQueryOptions } from '@/queries/posts'

export const Route = createFileRoute('/{-$locale}/posts/$slug')({
	loader: async ({ context: { queryClient, locale }, params: { slug } }) => {
		const { post } = await queryClient.query({ ...postQueryOptions(locale, slug), staleTime: 'static' })
		await preloadPostBody(post.filePath)
		return { title: post.title, description: post.description }
	},
	head: ({ loaderData }) => ({
		meta: loaderData ? [{ title: loaderData.title }, { name: 'description', content: loaderData.description }] : [],
	}),
	component: PostPage,
})

function PostPage() {
	const { locale } = Route.useRouteContext()
	const { slug } = Route.useParams()
	const {
		data: { post, fallback },
	} = useSuspenseQuery(postQueryOptions(locale, slug))
	const Body = getPostBody(post.filePath)

	return (
		<article lang={fallback ? post.locale : undefined}>
			{fallback ? (
				<p role="note" lang={locale} className="mb-8 rounded-md border px-4 py-3 text-sm text-muted-foreground">
					{messages[locale].fallbackNotice}
				</p>
			) : null}
			<header className="mb-8">
				<h1 className="text-3xl font-semibold tracking-tight">{post.title}</h1>
				<time dateTime={post.date} className="mt-2 block text-sm text-muted-foreground">
					{post.date}
				</time>
			</header>
			<div className="prose prose-neutral dark:prose-invert">
				<Suspense fallback={null}>
					{/* oxlint-disable-next-line react/static-components -- getPostBody returns a cached, stable component per post */}
					<Body components={mdxComponents} />
				</Suspense>
			</div>
		</article>
	)
}
