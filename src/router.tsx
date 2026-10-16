import { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'

import { routeTree } from './routeTree.gen'

export function getRouter() {
	// Content only changes on deploy, so cached queries stay fresh for a while.
	const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 5 * 60 * 1000 } } })
	const router = createRouter({
		routeTree,
		context: { queryClient },
		defaultPreload: 'intent',
		defaultPreloadStaleTime: 0,
		scrollRestoration: true,
	})
	setupRouterSsrQueryIntegration({ router, queryClient })
	return router
}

declare module '@tanstack/react-router' {
	// oxlint-disable-next-line typescript/consistent-type-definitions -- module augmentation requires an interface
	interface Register {
		router: ReturnType<typeof getRouter>
	}
}
