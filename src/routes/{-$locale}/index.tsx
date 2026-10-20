import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'

import hero768 from '@/assets/hero-768.webp'
import hero1376 from '@/assets/hero-1376.webp'
import { TextLink } from '@/components/text-link'
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
			{/* It stays put while the page scrolls: clip-path, unlike overflow, clips fixed descendants to the hero. */}
			<div aria-hidden className="absolute inset-0 -z-10 mask-b-from-60% mask-b-to-100% [clip-path:inset(0)]">
				<img
					src={hero1376}
					srcSet={`${hero768} 768w, ${hero1376} 1376w`}
					sizes="100vw"
					alt=""
					fetchPriority="high"
					className="fixed inset-x-0 top-0 h-lvh w-full object-cover"
				/>
				{/* Strongest behind the text so it stays legible on any photo. */}
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--hero-veil),var(--hero-veil-edge)_75%)]" />
			</div>
			<div className="flex max-w-3xl flex-col gap-6 text-center">
				<p className="text-eyebrow-gradient self-center text-sm font-bold tracking-[0.3em] uppercase">
					{t.heroGreeting}
				</p>
				<h1 className="text-4xl leading-tight text-balance sm:text-6xl">{t.heroClaim}</h1>
			</div>
		</section>
	)
}

function RecentPosts({ locale }: { locale: Locale }) {
	const t = messages[locale]
	const { data: posts } = useSuspenseQuery(postsQueryOptions(locale))
	const params = { locale: localeParam(locale) }
	return (
		<section aria-labelledby="recent-posts" className="mx-auto flex max-w-3xl flex-col gap-10 px-6 pt-8 pb-24">
			<div className="flex flex-col gap-8">
				<h2 id="recent-posts" className="text-eyebrow-gradient font-sans text-sm font-bold tracking-[0.3em] uppercase">
					{t.recentPosts}
				</h2>
				<ul className="flex flex-col gap-4">
					{posts.slice(0, recentPostCount).map((post) => (
						<li key={post.slug}>
							<Link
								to="/{-$locale}/posts/$slug"
								params={{ ...params, slug: post.slug }}
								className="flex flex-col gap-2 rounded-xl border bg-card/60 p-6 transition-colors hover:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
							>
								<time
									dateTime={post.date}
									className="text-xs leading-6.75 tracking-widest text-muted-foreground uppercase"
								>
									{formatDate(post.date, locale)}
								</time>
								<h3 className="text-3xl">{post.title}</h3>
								<p className="text-muted-foreground">{post.description}</p>
							</Link>
						</li>
					))}
				</ul>
			</div>
			<TextLink
				to="/{-$locale}/posts"
				params={params}
				className="self-start border-b border-highlight pb-1 text-sm tracking-wider hover:border-highlight-hover hover:no-underline"
			>
				{t.allPosts} →
			</TextLink>
		</section>
	)
}
