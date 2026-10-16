import { useState } from 'react'

import { Button } from '@/components/ui/button'

export function Counter() {
	const [count, setCount] = useState(0)
	return (
		<div className="not-prose my-6 flex items-center gap-3">
			<Button variant="outline" onPress={() => setCount((value) => value + 1)}>
				Increment
			</Button>
			<output aria-live="polite">Count: {count}</output>
		</div>
	)
}
