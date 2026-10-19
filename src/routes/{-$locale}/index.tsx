import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'

import hero768 from '@/assets/hero-768.webp'
import hero1376 from '@/assets/hero-1376.webp'
import { formatDate } from '@/lib/date'
import { type Locale, localeParam } from '@/lib/i18n'
import { messages } from '@/lib/messages'
import { postsQueryOptions } from '@/queries/posts'

const recentPostCount = 10

export const Route = createFileRoute('/{-$locale}/')({
	loader: async ({ context: { queryClient, locale } }) => {
		await queryClient.query(postsQueryOptions(locale))
	},
	component: Home,
})

function Home() {
	const { locale } = Route.useRouteContext()
	return (
		<>
			<Hero locale={locale} />
			<RecentPosts locale={locale} />
		</>
	)
}

function Hero({ locale }: { locale: Locale }) {
	const t = messages[locale]
	return (
		<section className="relative isolate flex min-h-[85svh] items-center justify-center overflow-hidden px-6">
			{/* The photo dissolves into the page background at the bottom, whatever the gradient there. */}
			<div aria-hidden className="absolute inset-0 -z-10 mask-b-from-60% mask-b-to-100%">
				<img
					src={hero1376}
					srcSet={`${hero768} 768w, ${hero1376} 1376w`}
					sizes="100vw"
					alt=""
					fetchPriority="high"
					className="size-full object-cover"
				/>
				{/* Strongest behind the text so it stays legible on any photo. */}
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--hero-veil),var(--hero-veil-edge)_75%)]" />
			</div>
			<div className="max-w-3xl text-center">
				<p className="text-sm font-medium tracking-[0.3em] text-highlight uppercase">{t.heroGreeting}</p>
				<h1 className="mt-6 text-4xl leading-tight text-balance sm:text-6xl">
					{t.heroDay}
					<br />
					<em>{t.heroNight}</em>
				</h1>
			</div>
		</section>
	)
}

function RecentPosts({ locale }: { locale: Locale }) {
	const t = messages[locale]
	const { data: posts } = useSuspenseQuery(postsQueryOptions(locale))
	const params = { locale: localeParam(locale) }
	return (
		<section aria-labelledby="recent-posts" className="mx-auto max-w-3xl px-6 pt-8 pb-24">
			<h2 id="recent-posts" className="font-sans text-sm font-medium tracking-[0.3em] text-highlight uppercase">
				{t.recentPosts}
			</h2>
			<ul className="mt-8 space-y-4">
				{posts.slice(0, recentPostCount).map((post) => (
					<li key={post.slug}>
						<Link
							to="/{-$locale}/posts/$slug"
							params={{ ...params, slug: post.slug }}
							className="block rounded-xl border bg-card/60 p-6 transition-colors hover:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
						>
							<time dateTime={post.date} className="text-xs tracking-widest text-muted-foreground uppercase">
								{formatDate(post.date, locale)}
							</time>
							<h3 className="mt-2 text-2xl">{post.title}</h3>
							<p className="mt-2 text-muted-foreground">{post.description}</p>
						</Link>
					</li>
				))}
			</ul>
			<Link
				to="/{-$locale}/posts"
				params={params}
				className="mt-10 inline-block border-b border-highlight pb-1 text-sm font-medium tracking-wider text-highlight"
			>
				{t.allPosts} →
			</Link>
		</section>
	)
}
