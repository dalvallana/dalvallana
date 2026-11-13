import { describe, expect, it } from 'vitest'

import { countWords, readingMinutes } from '@/content/reading-time'

describe('countWords', () => {
	it('counts words with accents, apostrophes and hyphens as one each', () => {
		expect(countWords('Él dijo: ¿qué tal? It’s a well-known fact.')).toBe(8)
	})

	it('skips markup that readers never see', () => {
		const mdx = [
			"import { Chart } from './chart'",
			'## Un título',
			'Texto con [un enlace](https://example.com/largo) y ![foto](a.webp).',
			'<Callout type="note">Dentro del aviso</Callout>',
			'{/* un comentario */}',
			'```ts',
			'const ignored = true',
			'```',
		].join('\n')
		expect(countWords(mdx)).toBe(10)
	})

	it('ignores emoji and punctuation', () => {
		expect(countWords('liberación animal 🌱🐷 — ¡ya!')).toBe(3)
	})
})

function words(count: number) {
	return Array.from({ length: count }, () => 'palabra').join(' ')
}

describe('readingMinutes', () => {
	it('rounds to the nearest minute at 200 wpm', () => {
		expect(readingMinutes(words(927))).toBe(5)
		expect(readingMinutes(words(1290))).toBe(6)
	})

	it('never reports less than a minute', () => {
		expect(readingMinutes('')).toBe(1)
	})
})
