const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/
const draftTrue = /^draft:\s*(?:true|True|TRUE)\s*(?:#.*)?$/m

/** Whether an MDX source's leading frontmatter block sets `draft: true`. */
export function isDraftMdx(source: string): boolean {
	const block = frontmatter.exec(source)?.[1]
	return block !== undefined && draftTrue.test(block.replaceAll('\r', ''))
}
