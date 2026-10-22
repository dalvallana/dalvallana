import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'

import { mdxComponents } from '@/components/mdx/mdx-components'
import { getPostBody, preloadPostBody } from '@/content/mdx'
import { alternateLinks, canonicalLink } from '@/lib/alternates'
import { messages } from '@/lib/messages'
import { postQueryOptions } from '@/queries/posts'

export const Route = createFileRoute('/{-$locale}/posts/$slug')({
	loader: async ({ context: { queryClient, locale }, params: { slug } }) => {
		const { post, fallback, translations } = await queryClient.query(postQueryOptions(locale, slug))
		await preloadPostBody(post.filePath)
		return {
			title: post.title,
			description: post.description,
			path: `/posts/${slug}`,
			fallback,
			translations,
			postLocale: post.locale,
		}
	},
	head: ({ loaderData }) => {
		if (!loaderData) return {}
		const { title, description, path, fallback, translations, postLocale } = loaderData
		return {
			meta: [{ title }, { name: 'description', content: description }],
			// A fallback repeats another locale's post, so it defers to that URL instead of competing with it.
			links: fallback ? [canonicalLink(postLocale, path)] : alternateLinks(path, translations),
		}
	},
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
		<article lang={fallback ? post.locale : undefined} className="flex flex-col gap-8">
			{fallback ? (
				<p role="note" lang={locale} className="rounded-md border px-4 py-3 text-sm text-muted-foreground">
					{messages[locale].fallbackNotice}
				</p>
			) : null}
			<header className="flex flex-col gap-2">
				<h1 className="text-5xl font-semibold tracking-tight">{post.title}</h1>
				<time dateTime={post.date} className="text-sm text-muted-foreground">
					{post.date}
				</time>
			</header>
			<div className="prose prose-lg prose-neutral dark:prose-invert">
				<Suspense fallback={null}>
					{/* oxlint-disable-next-line react/static-components -- getPostBody returns a cached, stable component per post */}
					<Body components={mdxComponents} />
				</Suspense>
			</div>
		</article>
	)
}
