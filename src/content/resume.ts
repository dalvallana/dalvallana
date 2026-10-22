import type { Locale } from '@/lib/i18n'

type Experience = {
	role: string
	company: string
	start: number
	/** Omitted for the current position. */
	end?: number
	location: string
	description?: string
	highlights?: readonly string[]
}

type Education = {
	degree: string
	school: string
	start: number
	end: number
	location: string
	honors?: string
}

export type Resume = {
	/** Takes the years of experience, so the number never goes stale. */
	summary: (years: number) => string
	location: string
	/** Newest first. */
	experience: readonly Experience[]
	education: readonly Education[]
	skills: readonly string[]
	strengths: readonly string[]
}

/** The year of the first professional position, which years of experience count from. */
export const careerStart = 2010

export const linkedInUrl = 'https://www.linkedin.com/in/dalvallana'

/** A hand-made PDF served from `public/`; it is maintained separately from the content below. */
export const resumePdfUrl = '/diego-alvarado-orellana-resume.pdf'

/** Whole calendar years since `startYear`, so "16+ years" reads true all year long. */
export function yearsSince(startYear: number, now: Date) {
	return now.getUTCFullYear() - startYear
}

export const resume: Record<Locale, Resume> = {
	en: {
		summary: (years) =>
			`Full-stack software engineer with ${years}+ years of experience in web and front-end technologies, with an emphasis on accessibility, performance and responsiveness.`,
		location: 'Madrid, Spain',
		experience: [
			{
				role: 'Web Engineer, Siri',
				company: 'Apple',
				start: 2019,
				location: 'Madrid, Spain',
				description:
					'I build web apps that support the work of quality engineers and testers to ensure Siri works correctly, ultimately impacting millions of Apple customers.',
			},
			{
				role: 'UI Software Engineer',
				company: 'Expedia Group',
				start: 2018,
				end: 2019,
				location: 'Madrid, Spain',
				highlights: [
					'Created web experiences seen by over 100 million people a month.',
					'Migrated the existing Backbone.js code base to React and Node, improving performance and increasing conversion by 10%.',
					'Leveraged real-time user behavior data and A/B testing to better understand customers.',
				],
			},
			{
				role: 'Front-End Software Engineer',
				company: 'Fonetic',
				start: 2015,
				end: 2018,
				location: 'Madrid, Spain',
				description:
					'Built the company’s flagship product: a web app that helps financial institutions analyze and catch fraudulent trading operations.',
			},
			{
				role: 'Research Assistant',
				company: 'Universidad Carlos III de Madrid',
				start: 2011,
				end: 2015,
				location: 'Madrid, Spain',
				description:
					'My research looked for new paradigms of human-computer interaction to help children become co-designers of social games.',
			},
			{
				role: 'Software Engineer',
				company: 'Vikua',
				start: 2010,
				end: 2011,
				location: 'Caracas, Venezuela',
				description:
					'Designed and implemented a system that connected traffic cameras and traffic lights to a remote control center over TCP/IP, and built a desktop application to manage it.',
			},
		],
		education: [
			{
				degree: 'M.S. in Human-Computer Interaction',
				school: 'Universidad Carlos III de Madrid',
				start: 2010,
				end: 2011,
				location: 'Madrid, Spain',
			},
			{
				degree: 'B.S. in Electrical Engineering',
				school: 'Universidad Simón Bolívar',
				start: 2004,
				end: 2010,
				location: 'Caracas, Venezuela',
				honors: 'summa cum laude',
			},
		],
		skills: [
			'TypeScript',
			'JavaScript',
			'HTML',
			'CSS',
			'React',
			'Vue',
			'TanStack',
			'Node.js',
			'UI/UX',
			'Accessibility',
			'Performance',
			'Responsive design',
		],
		strengths: [
			'I’m a lifelong learner, always eager to learn new skills and technologies. I also enjoy teaching and mentoring.',
			'I’m detail-oriented and constantly looking for ways to improve my work.',
			'Although I enjoy working independently, I also thrive working collaboratively with peers and cross-functional teams.',
			'Working with diverse, multicultural teams has given me a knack for out-of-the-box thinking and for finding simple solutions to complex problems, or at least making them seem simple for end users.',
		],
	},
	es: {
		summary: (years) =>
			`Ingeniero de software full-stack con más de ${years} años de experiencia en tecnologías web y front-end, con énfasis en accesibilidad, rendimiento y diseño adaptable.`,
		location: 'Madrid, España',
		experience: [
			{
				role: 'Ingeniero web, Siri',
				company: 'Apple',
				start: 2019,
				location: 'Madrid, España',
				description:
					'Desarrollo aplicaciones web que apoyan el trabajo de ingenieros de calidad y testers para asegurar que Siri funcione correctamente, lo que en última instancia repercute en millones de clientes de Apple.',
			},
			{
				role: 'Ingeniero de software de UI',
				company: 'Expedia Group',
				start: 2018,
				end: 2019,
				location: 'Madrid, España',
				highlights: [
					'Creé experiencias web vistas por más de 100 millones de personas al mes.',
					'Migré el código existente de Backbone.js a React y Node, mejorando el rendimiento y aumentando la conversión un 10 %.',
					'Aproveché datos de comportamiento de usuarios en tiempo real y tests A/B para entender mejor a los clientes.',
				],
			},
			{
				role: 'Ingeniero de software front-end',
				company: 'Fonetic',
				start: 2015,
				end: 2018,
				location: 'Madrid, España',
				description:
					'Construí el producto estrella de la empresa: una aplicación web que ayuda a las entidades financieras a analizar y detectar operaciones bursátiles fraudulentas.',
			},
			{
				role: 'Asistente de investigación',
				company: 'Universidad Carlos III de Madrid',
				start: 2011,
				end: 2015,
				location: 'Madrid, España',
				description:
					'Mi investigación buscaba nuevos paradigmas de interacción persona-ordenador para ayudar a niños y niñas a convertirse en codiseñadores de juegos sociales.',
			},
			{
				role: 'Ingeniero de software',
				company: 'Vikua',
				start: 2010,
				end: 2011,
				location: 'Caracas, Venezuela',
				description:
					'Diseñé e implementé un sistema que conectaba cámaras de tráfico y semáforos con una central remota mediante TCP/IP, y desarrollé una aplicación de escritorio para gestionarlo.',
			},
		],
		education: [
			{
				degree: 'Máster en Interacción Persona-Ordenador',
				school: 'Universidad Carlos III de Madrid',
				start: 2010,
				end: 2011,
				location: 'Madrid, España',
			},
			{
				degree: 'Ingeniería Eléctrica',
				school: 'Universidad Simón Bolívar',
				start: 2004,
				end: 2010,
				location: 'Caracas, Venezuela',
				honors: 'summa cum laude',
			},
		],
		skills: [
			'TypeScript',
			'JavaScript',
			'HTML',
			'CSS',
			'React',
			'Vue',
			'TanStack',
			'Node.js',
			'UI/UX',
			'Accesibilidad',
			'Rendimiento',
			'Diseño adaptable',
		],
		strengths: [
			'Me encanta aprender: siempre tengo ganas de adquirir nuevas habilidades y tecnologías. También disfruto enseñando y haciendo de mentor.',
			'Soy detallista y busco constantemente formas de mejorar mi trabajo.',
			'Aunque disfruto trabajando de forma independiente, también me desenvuelvo muy bien colaborando con compañeros y equipos multidisciplinares.',
			'Trabajar con equipos diversos y multiculturales me ha dado facilidad para pensar de forma creativa y encontrar soluciones sencillas a problemas complejos, o al menos hacer que lo parezcan para los usuarios finales.',
		],
	},
}
