export type Cover = { src: string; srcSet: string }

/** Groups files named `<image>-<width>.webp` by image; `src` is the widest. */
export function buildCovers(files: Record<string, string>): Map<string, Cover> {
	const widths = new Map<string, { width: number; url: string }[]>()
	for (const [path, url] of Object.entries(files)) {
		const match = /([^/]+)-(\d+)\.webp$/.exec(path)
		if (!match) continue
		const [, image, width] = match
		widths.set(image, [...(widths.get(image) ?? []), { width: Number(width), url }])
	}
	const covers = new Map<string, Cover>()
	for (const [image, sizes] of widths) {
		const sorted = sizes.toSorted((a, b) => a.width - b.width)
		const widest = sorted.at(-1)
		if (!widest) continue
		covers.set(image, { src: widest.url, srcSet: sorted.map(({ width, url }) => `${url} ${width}w`).join(', ') })
	}
	return covers
}

const covers = buildCovers(
	import.meta.glob<string>('/src/assets/covers/*.webp', { eager: true, query: '?url', import: 'default' }),
)

/** Throws for an unknown image so a typo in frontmatter fails the prerender instead of shipping a broken img. */
export function getCover(image: string): Cover {
	const cover = covers.get(image)
	if (!cover) throw new Error(`No cover files for "${image}" in src/assets/covers`)
	return cover
}
