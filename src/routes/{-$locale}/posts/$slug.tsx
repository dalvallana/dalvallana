import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Fragment, Suspense } from 'react'

import { mdxComponents } from '@/components/mdx/mdx-components'
import { PageTitle } from '@/components/page-title'
import { TextLink } from '@/components/text-link'
import { getCover } from '@/content/covers'
import { getPostBody, preloadPostBody } from '@/content/mdx'
import { alternateLinks, canonicalLink } from '@/lib/alternates'
import { type Locale, localeParam } from '@/lib/i18n'
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
		data: { post, fallback, translations },
	} = useSuspenseQuery(postQueryOptions(locale, slug))
	const Body = getPostBody(post.filePath)
	const cover = post.cover ? { ...getCover(post.cover.image), alt: post.cover.alt } : null

	return (
		<article lang={fallback ? post.locale : undefined} className="flex flex-col gap-8">
			{fallback ? (
				<p role="note" lang={locale} className="rounded-md border px-4 py-3 text-sm text-muted-foreground">
					{messages[locale].fallbackNotice}
				</p>
			) : null}
			<header className="flex flex-col gap-2">
				<PageTitle>{post.title}</PageTitle>
				<p className="flex gap-2 text-sm text-muted-foreground">
					<time dateTime={post.date}>{post.date}</time>
					<span aria-hidden>·</span>
					{/* A UI string, so a fallback post (in another language) still labels it in the reader's. */}
					<span lang={fallback ? locale : undefined}>{messages[locale].readingTime(post.readingTime)}</span>
				</p>
				{translations.length > 1 ? <PostLanguages locale={locale} slug={slug} translations={translations} /> : null}
			</header>
			{cover ? (
				// The fixed ratio reserves the space before the image loads and crops photos of any shape alike.
				<img
					src={cover.src}
					srcSet={cover.srcSet}
					sizes="(min-width: 48rem) 45rem, 100vw"
					alt={cover.alt}
					fetchPriority="high"
					className="aspect-3/2 w-full rounded-xl object-cover shadow-md"
				/>
			) : null}
			<div className="prose prose-lg prose-neutral dark:prose-invert">
				<Suspense fallback={null}>
					{/* oxlint-disable-next-line react/static-components -- getPostBody returns a cached, stable component per post */}
					<Body components={mdxComponents} />
				</Suspense>
			</div>
		</article>
	)
}

type PostLanguagesProps = { locale: Locale; slug: string; translations: Locale[] }

/** Only shown for translated posts, so the current locale is always one of them; the others link to their version. */
function PostLanguages({ locale, slug, translations }: PostLanguagesProps) {
	return (
		<p className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
			<span>{messages[locale].availableIn}</span>
			{translations.map((translation, index) => (
				<Fragment key={translation}>
					{index > 0 ? <span aria-hidden>·</span> : null}
					{translation === locale ? (
						<span lang={translation} className="font-medium text-foreground">
							{messages[translation].localeName}
						</span>
					) : (
						<TextLink
							to="/{-$locale}/posts/$slug"
							params={{ locale: localeParam(translation), slug }}
							lang={translation}
							hrefLang={translation}
						>
							{messages[translation].localeName}
						</TextLink>
					)}
				</Fragment>
			))}
		</p>
	)
}
