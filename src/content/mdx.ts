import { notFound } from '@tanstack/react-router'
import type { MDXContent, MDXModule } from 'mdx/types'
import { type LazyExoticComponent, lazy } from 'react'

// One lazy chunk per post; keys look like `/content/posts/en/hello-world.mdx`.
const modules: Partial<Record<string, () => Promise<MDXModule>>> = import.meta.glob<MDXModule>(
	'/content/posts/**/*.mdx',
)
// Bodies whose chunk has loaded render synchronously, so SSR and prerendered HTML include them inline.
const loaded = new Map<string, MDXContent>()
const lazyBodies = new Map<string, LazyExoticComponent<MDXContent>>()

function moduleLoader(filePath: string) {
	const load = modules[`/content/posts/${filePath}`]
	if (!load) throw notFound()
	return load
}

/** Loads a post body so the first render can use it without suspending. */
export async function preloadPostBody(filePath: string) {
	const module = await moduleLoader(filePath)()
	loaded.set(filePath, module.default)
}

/** A stable component per post, safe to call during render; lazy only if not preloaded. */
export function getPostBody(filePath: string): MDXContent | LazyExoticComponent<MDXContent> {
	const body = loaded.get(filePath)
	if (body) return body
	let lazyBody = lazyBodies.get(filePath)
	if (!lazyBody) {
		lazyBody = lazy(moduleLoader(filePath))
		lazyBodies.set(filePath, lazyBody)
	}
	return lazyBody
}
