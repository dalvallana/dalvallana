const wordsPerMinute = 200

/** Counts the prose in an MDX body: code, imports/exports, JSX tags, expressions and link targets are skipped. */
export function countWords(mdx: string): number {
	const prose = mdx
		.replaceAll(/^```[\s\S]*?^```/gm, ' ')
		.replaceAll(/^(?:import|export)\s.*$/gm, ' ')
		.replaceAll(/\{[^}]*\}/g, ' ')
		.replaceAll(/!\[[^\]]*\]\([^)]*\)/g, ' ')
		.replaceAll(/\]\([^)]*\)/g, ' ')
		.replaceAll(/<[^>]+>/g, ' ')
	return prose.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)?.length ?? 0
}

/** Whole minutes at 200 words per minute, never less than one. */
export function readingMinutes(mdx: string): number {
	return Math.max(1, Math.round(countWords(mdx) / wordsPerMinute))
}
