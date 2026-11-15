/** A YouTube video, embedded from the privacy-enhanced domain and loaded only when scrolled near. */
export function YouTube({ id, title }: { id: string; title: string }) {
	return (
		<div className="not-prose my-8 aspect-video overflow-hidden rounded-lg border bg-muted">
			<iframe
				src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`}
				title={title}
				loading="lazy"
				allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowFullScreen
				referrerPolicy="strict-origin-when-cross-origin"
				// The player needs scripts and its own origin to play, and popups for "Watch on YouTube". The pair is only
				// unsafe for same-origin frames, which can strip their own sandbox; YouTube's is cross-origin.
				// oxlint-disable-next-line react/iframe-missing-sandbox -- the player shows a black box without allow-same-origin
				sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox"
				className="size-full"
			/>
		</div>
	)
}
