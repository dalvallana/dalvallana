import { createFileRoute } from '@tanstack/react-router'
import { cn } from 'cn'
import { DownloadIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { PageTitle } from '@/components/page-title'
import { TextAnchor } from '@/components/text-link'
import { Badge } from '@/components/ui/badge'
import { LinkButton } from '@/components/ui/button'
import { careerStart, linkedInUrl, resume, resumePdfUrl, yearsSince } from '@/content/resume'
import { alternateLinks } from '@/lib/alternates'
import { messages } from '@/lib/messages'
import { siteName } from '@/lib/site'

export const Route = createFileRoute('/{-$locale}/resume')({
	// Computed in the loader so hydration reuses the prerendered number even after the year turns.
	loader: () => ({ years: yearsSince(careerStart, new Date()) }),
	head: ({ match }) => ({
		meta: [{ title: `${messages[match.context.locale].resume} · ${siteName}` }],
		links: alternateLinks('/resume'),
	}),
	component: ResumePage,
})

function ResumePage() {
	const { locale } = Route.useRouteContext()
	const { years } = Route.useLoaderData()
	const t = messages[locale]
	const r = resume[locale]
	return (
		<article className="flex flex-col gap-14 print:gap-4 print:text-xs print:leading-snug">
			<header className="flex flex-col gap-6 print:gap-3">
				<div className="flex flex-col gap-3 print:gap-1">
					{/* A saved PDF travels on its own, so paper still says whose resume it is. */}
					<p className="hidden text-eyebrow-gradient text-sm font-bold tracking-[0.3em] uppercase print:block">
						{t.heroName}
					</p>
					<PageTitle className="print:text-3xl">{t.resume}</PageTitle>
				</div>
				<p className="text-xl leading-relaxed print:text-xs print:leading-snug">{r.summary(years)}</p>
				<div className="flex flex-wrap items-center justify-between gap-4">
					<p className="flex flex-wrap gap-x-3 text-sm text-muted-foreground">
						<span>{r.location}</span>
						<span aria-hidden>·</span>
						<TextAnchor href={linkedInUrl}>linkedin.com/in/dalvallana</TextAnchor>
					</p>
					<LinkButton variant="outline" href={resumePdfUrl} download className="print:hidden">
						<DownloadIcon aria-hidden />
						{t.downloadPdf}
					</LinkButton>
				</div>
			</header>

			<ResumeSection id="experience" title={t.experience}>
				<ol className="flex flex-col gap-10 border-l print:gap-3">
					{r.experience.map((job) => (
						<li
							key={`${job.company}-${job.start}`}
							className="relative flex flex-col gap-3 pl-8 print:break-inside-avoid print:gap-1 print:pl-5"
						>
							<span aria-hidden className="absolute top-3 -left-1.25 size-2.5 rounded-full bg-highlight print:hidden" />
							<div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
								<div className="flex flex-col">
									<h3 className="text-2xl print:text-base">{job.role}</h3>
									<p className="font-semibold">{job.company}</p>
								</div>
								<p className="flex shrink-0 flex-col text-sm text-muted-foreground sm:text-right">
									<span>
										{job.start} – {job.end ?? t.present}
									</span>
									<span>{job.location}</span>
								</p>
							</div>
							{job.description ? <p className="text-muted-foreground">{job.description}</p> : null}
							{job.highlights ? (
								<ul className="flex list-disc flex-col gap-1 pl-5 text-muted-foreground marker:text-highlight">
									{job.highlights.map((highlight) => (
										<li key={highlight}>{highlight}</li>
									))}
								</ul>
							) : null}
						</li>
					))}
				</ol>
			</ResumeSection>

			<div className="flex flex-col gap-14 sm:flex-row sm:gap-10 print:flex-row print:gap-10">
				<ResumeSection id="education" title={t.education} className="flex-1">
					<ul className="flex flex-col gap-5 print:gap-2">
						{r.education.map((degree) => (
							<li key={degree.degree} className="flex flex-col">
								<h3 className="text-xl print:text-sm">{degree.degree}</h3>
								<p>{degree.school}</p>
								<p className="text-sm text-muted-foreground">
									{degree.start} – {degree.end} · {degree.location}
								</p>
								{degree.honors ? <p className="text-sm text-muted-foreground italic">{degree.honors}</p> : null}
							</li>
						))}
					</ul>
				</ResumeSection>
				<ResumeSection id="skills" title={t.skills} className="flex-1">
					<ul className="flex flex-wrap gap-2">
						{r.skills.map((skill) => (
							<li key={skill}>
								<Badge variant="outline">{skill}</Badge>
							</li>
						))}
					</ul>
				</ResumeSection>
			</div>

			<ResumeSection id="strengths" title={t.strengths}>
				<ul className="flex list-disc flex-col gap-2 pl-5 marker:text-highlight print:gap-1">
					{r.strengths.map((strength) => (
						<li key={strength}>{strength}</li>
					))}
				</ul>
			</ResumeSection>
		</article>
	)
}

type ResumeSectionProps = {
	id: string
	title: string
	className?: string
	children: ReactNode
}

function ResumeSection({ id, title, className, children }: ResumeSectionProps) {
	return (
		<section aria-labelledby={id} className={cn('flex flex-col gap-6 print:gap-2', className)}>
			<h2 id={id} className="text-eyebrow-gradient font-sans text-sm font-bold tracking-[0.3em] uppercase">
				{title}
			</h2>
			{children}
		</section>
	)
}
