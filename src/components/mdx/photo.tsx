import { buildCovers } from '@/content/covers'

// Same `<image>-<width>.webp` naming as covers, kept in their own folder so body photos and covers don't mix.
const photos = buildCovers(
	import.meta.glob<string>('/src/assets/photos/*.webp', { eager: true, query: '?url', import: 'default' }),
)

/** A photo in a post body, from src/assets/photos. An unknown `image` throws so a typo fails the prerender. */
export function Photo({ image, alt }: { image: string; alt: string }) {
	const photo = photos.get(image)
	if (!photo) throw new Error(`No photo files for "${image}" in src/assets/photos`)
	return (
		<img
			src={photo.src}
			srcSet={photo.srcSet}
			sizes="(min-width: 48rem) 45rem, 100vw"
			alt={alt}
			loading="lazy"
			decoding="async"
			className="not-prose my-8 h-auto w-full rounded-lg shadow-md"
		/>
	)
}
