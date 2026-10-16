import { notFound } from '@tanstack/react-router'
import type { MDXContent, MDXModule } from 'mdx/types'
import { type LazyExoticComponent, lazy } from 'react'

// One lazy chunk per post; keys look like `/content/posts/en/hello-world.mdx`.
const modules: Partial<Record<string, () => Promise<MDXModule>>> = import.meta.glob<MDXModule>(
	'/content/posts/**/*.mdx',
)
const bodies = new Map<string, LazyExoticComponent<MDXContent>>()

function moduleLoader(filePath: string) {
	const load = modules[`/content/posts/${filePath}`]
	if (!load) throw notFound()
	return load
}

/** Starts loading a post body so rendering doesn't wait for the chunk. */
export function preloadPostBody(filePath: string) {
	return moduleLoader(filePath)()
}

/** A stable lazy component per post, safe to call during render. */
export function getPostBody(filePath: string) {
	let body = bodies.get(filePath)
	if (!body) {
		body = lazy(moduleLoader(filePath))
		bodies.set(filePath, body)
	}
	return body
}
