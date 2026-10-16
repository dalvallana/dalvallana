import { createFileRoute } from '@tanstack/react-router'
import { siteName } from '@/lib/site'

export const Route = createFileRoute('/{-$locale}/')({ component: Home })

function Home() {
	return <h1>{siteName}</h1>
}
