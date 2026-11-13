import { Mail } from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'

import { GitHubIcon, InstagramIcon, LinkedInIcon, XIcon } from '@/components/brand-icons'
import { TextAnchor } from '@/components/text-link'
import type { Locale } from '@/lib/i18n'
import { messages } from '@/lib/messages'
import { email, repoUrl, socialLinks } from '@/lib/site'

// Read once at module load: render stays pure. A long-running server shows its start year until restarted.
const currentYear = new Date().getFullYear()

type Social = {
	label: string
	href: string
	Icon: ComponentType<SVGProps<SVGSVGElement>>
	/** Opens in a new tab, so visitors keep their place on the site. */
	external?: boolean
}

export function SiteFooter({ locale }: { locale: Locale }) {
	const t = messages[locale]
	const socials: Social[] = [
		{ label: t.email, href: `mailto:${email}`, Icon: Mail },
		{ label: 'LinkedIn', href: socialLinks.linkedin, Icon: LinkedInIcon, external: true },
		{ label: 'Instagram', href: socialLinks.instagram, Icon: InstagramIcon, external: true },
		{ label: 'X (Twitter)', href: socialLinks.x, Icon: XIcon, external: true },
	]
	return (
		<footer className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 pb-12 print:hidden">
			{/* A hairline in the eyebrow colors that fades out at both ends. */}
			<div aria-hidden className="h-px bg-linear-to-r from-transparent via-(--eyebrow-to) to-transparent" />
			<ul aria-label={t.elsewhere} className="flex items-center justify-center gap-3">
				{socials.map(({ label, href, Icon, external = false }) => (
					<li key={href}>
						<a
							href={href}
							{...(external && { target: '_blank', rel: 'noopener noreferrer' })}
							// Screen readers announce the new tab, which sighted users can't see coming either.
							aria-label={external ? `${label} (${t.opensInNewTab})` : label}
							title={label}
							className="flex size-11 items-center justify-center rounded-full border border-foreground/15 text-foreground/80 transition hover:-translate-y-0.5 hover:border-highlight hover:text-highlight motion-reduce:hover:translate-y-0"
						>
							<Icon className="size-[1.125rem]" />
						</a>
					</li>
				))}
			</ul>
			{/* Stacked until md, where the whole line fits in both languages (the Spanish one is about 650px wide). */}
			<div className="flex flex-col items-center gap-1 text-sm text-muted-foreground md:flex-row md:justify-center md:gap-3">
				<p>
					{/* Prerendered pages bake in the build year, which may differ from the visitor's clock. */}
					<span suppressHydrationWarning>© {currentYear}</span> Diego Alvarado Orellana
				</p>
				<span aria-hidden className="hidden md:inline">
					·
				</span>
				<p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
					<span className="flex items-center gap-2 whitespace-nowrap">
						<GitHubIcon className="size-4" />
						{t.openSource}
					</span>
					<TextAnchor
						href={repoUrl}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`${t.viewSource} (${t.opensInNewTab})`}
						className="whitespace-nowrap"
					>
						{t.viewSource}
					</TextAnchor>
				</p>
			</div>
		</footer>
	)
}
