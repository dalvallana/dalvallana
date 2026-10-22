import type { Locale } from '@/lib/i18n'

type Messages = {
	/** The language's own name, shown in the locale dropdown. */
	localeName: string
	language: string
	toggleTheme: string
	/** Names the small-screen navigation button and its popover. */
	menu: string
	heroName: string
	/** One string per line. */
	heroClaim: readonly string[]
	about: string
	portraitAlt: string
	/** One string per paragraph. */
	intro: readonly string[]
	recentPosts: string
	posts: string
	allPosts: string
	resume: string
	experience: string
	education: string
	skills: string
	strengths: string
	/** End of the current position's date range. */
	present: string
	downloadPdf: string
	fallbackNotice: string
	notFoundTitle: string
	notFoundBody: string
	goHome: string
}

// Plain objects until an i18n library is chosen; keys mirror what the UI needs today.
export const messages: Record<Locale, Messages> = {
	en: {
		localeName: 'English',
		language: 'Language',
		toggleTheme: 'Toggle dark mode',
		menu: 'Menu',
		heroName: 'Diego Alvarado Orellana',
		heroClaim: ['Software engineer and', 'animal liberation activist'],
		about: 'About',
		portraitAlt: 'Diego smiling in a selfie on a tiled rooftop, with a tabby cat walking toward the camera',
		intro: [
			'Hello! I’m a software engineer at Apple, living in Madrid. When I’m not building apps, I put my time into helping animals through activism and volunteering.',
			'I also like playing tennis, building with Lego and tinkering with home automation. Lately I’ve been learning about gardening, nutrition, carpentry and construction.',
		],
		recentPosts: 'Recent writing',
		posts: 'Posts',
		allPosts: 'Read all posts',
		resume: 'Resume',
		experience: 'Experience',
		education: 'Education',
		skills: 'Skills',
		strengths: 'Strengths',
		present: 'Present',
		downloadPdf: 'Download PDF',
		fallbackNotice: 'This post is not available in English yet.',
		notFoundTitle: 'Page not found',
		notFoundBody: 'The page you are looking for does not exist.',
		goHome: 'Go to the home page',
	},
	es: {
		localeName: 'Español',
		language: 'Idioma',
		toggleTheme: 'Cambiar modo oscuro',
		menu: 'Menú',
		heroName: 'Diego Alvarado Orellana',
		heroClaim: ['Ingeniero de software y', 'activista por la liberación animal'],
		about: 'Sobre mí',
		portraitAlt: 'Diego sonriendo en un selfi sobre un tejado, con un gato atigrado caminando hacia la cámara',
		intro: [
			'¡Hola! Soy ingeniero de software en Apple y vivo en Madrid. Cuando no estoy creando aplicaciones, dedico mi tiempo a ayudar a los animales, ya sea a través del activismo o el voluntariado.',
			'También me gusta jugar tenis, construir con Lego y trastear con aparatos de domótica. Últimamente estoy aprendiendo sobre jardinería, nutrición, carpintería y construcción.',
		],
		recentPosts: 'Artículos recientes',
		posts: 'Artículos',
		allPosts: 'Ver todos los artículos',
		resume: 'Currículum',
		experience: 'Experiencia',
		education: 'Formación',
		skills: 'Habilidades',
		strengths: 'Fortalezas',
		present: 'Actualidad',
		downloadPdf: 'Descargar PDF',
		fallbackNotice: 'Este artículo aún no está disponible en español; estás leyendo la versión en inglés.',
		notFoundTitle: 'Página no encontrada',
		notFoundBody: 'La página que buscas no existe.',
		goHome: 'Ir a la página de inicio',
	},
}
