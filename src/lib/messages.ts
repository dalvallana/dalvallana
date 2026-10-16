import type { Locale } from '@/lib/i18n'

type Messages = {
	tagline: string
	posts: string
	allPosts: string
	fallbackNotice: string
	notFoundTitle: string
	notFoundBody: string
	goHome: string
}

// Plain objects until an i18n library is chosen; keys mirror what the UI needs today.
export const messages: Record<Locale, Messages> = {
	en: {
		tagline: 'A personal blog.',
		posts: 'Posts',
		allPosts: 'Read all posts',
		fallbackNotice: 'This post is not available in English yet.',
		notFoundTitle: 'Page not found',
		notFoundBody: 'The page you are looking for does not exist.',
		goHome: 'Go to the home page',
	},
	es: {
		tagline: 'Un blog personal.',
		posts: 'Artículos',
		allPosts: 'Ver todos los artículos',
		fallbackNotice: 'Este artículo aún no está disponible en español; estás leyendo la versión en inglés.',
		notFoundTitle: 'Página no encontrada',
		notFoundBody: 'La página que buscas no existe.',
		goHome: 'Ir a la página de inicio',
	},
}
