# Blog scaffold: design

**Date:** 2026-10-16
**Status:** Approved in conversation, pending spec review

## Goal

A working skeleton for a personal blog that can grow into a larger app. It covers the toolchain, the content pipeline, routing with locale support, theming, and tests. The visual design is deliberately out of scope.

The app is client-first: data goes through TanStack Query so it is cached on the client. It still relies on SSR, with prerendering where the content is static.

## Scope

**In scope**

- Fresh TanStack Start app (Vite-based, not the old Vinxi layout).
- TanStack Router with an optional locale segment, and TanStack Query integrated with SSR.
- MDX posts managed by content-collections, with one sample post in `en` and `es` that uses a custom React component.
- Three routes: home, posts index, post page.
- Tailwind v4, shadcn using the React Aria base, and light and dark themes via a cookie and `data-theme`.
- Zod 4 for frontmatter, server function inputs and theme cookie values.
- Vitest browser mode (Playwright provider), Playwright e2e tests, and axe accessibility checks.
- Oxlint and Oxfmt configured from the existing Biome rules (mapping below).
- TypeScript 7 (`tsc`, the native compiler) for type-checking, using the user's tsconfig plus a few agreed additions.
- Lefthook pre-commit, GitHub Actions running the tests, and Dependabot.

**Out of scope (later)**

Visual design, CMS or database, i18n library for UI strings, env validation, analytics, error monitoring, the hosting adapter, RSS, sitemap, image optimization, Knip.

## Stack and runtime

| Concern                         | Choice                                                                                                           |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Package manager / script runner | Bun (`packageManager` pinned in `package.json`)                                                                  |
| Runtime (dev, test, build)      | Node LTS (pinned in `.nvmrc`)                                                                                    |
| Framework                       | TanStack Start, Router, Query                                                                                    |
| Content                         | content-collections (frontmatter) + `@mdx-js/rollup` (MDX bodies)                                                |
| UI                              | shadcn (style `aria-nova`, `react-aria-components`), Tailwind v4, `@tailwindcss/typography`, `cn` (shadcn-ui/cn) |
| Validation                      | Zod 4                                                                                                            |
| Types                           | TypeScript 7.0 (`tsc` is the native Go compiler)                                                                 |
| Unit/component tests            | Vitest browser mode, Playwright provider, `vitest-browser-react`                                                 |
| E2E                             | Playwright, `@axe-core/playwright`                                                                               |
| Lint / format                   | Oxlint (type-aware), Oxfmt                                                                                       |
| Git hooks                       | Lefthook                                                                                                         |
| CI                              | GitHub Actions (tests only)                                                                                      |
| Dependency updates              | Dependabot                                                                                                       |

**Rule: no runtime-only Node APIs in app code.** Cloudflare Workers is a likely deploy target. App code must not use `fs`, `path` or similar at request time. Build-time tooling (Vite plugins, content-collections config) may use them. An Oxlint `no-restricted-imports` override on `src/**` enforces this.

## Project layout

```
content/
  posts/
    en/hello-world.mdx
    en/only-in-english.mdx     # exercises the language fallback
    es/hello-world.mdx
src/
  routes/
    __root.tsx                 # html shell, head, data-theme, error/notFound components
    {-$locale}/
      route.tsx                # locale validation and `/en` redirect (beforeLoad) + layout
      index.tsx                # home
      posts/index.tsx          # posts list
      posts/$slug.tsx          # post page
  content/
    posts.ts                   # source boundary: getPosts(locale), getPost(locale, slug)
    select.ts                  # pure locale/draft filtering, ordering and fallback
    drafts.ts                  # isDraftMdx(): frontmatter `draft: true` check
    mdx.ts                     # import.meta.glob map of MDX bodies, cached components
  queries/
    posts.ts                   # postsQueryOptions(locale), postQueryOptions(locale, slug)
  components/
    ui/                        # shadcn (React Aria) components
    mdx/                       # components available inside posts + mdxComponents map
  lib/
    i18n.ts                    # locales, default locale, parseLocale()
    theme.ts                   # theme values, cookie parsing, pre-paint script
    theme-env.ts               # getTheme (isomorphic), persistTheme (browser)
  styles/app.css               # Tailwind entry, light-dark() tokens, dark variant
  router.tsx                   # createRouter + setupRouterSsrQueryIntegration
content-collections.ts
e2e/
vite/exclude-drafts.ts         # build-only plugin that empties draft MDX sources
vite.config.ts
vitest.config.ts
playwright.config.ts
.oxlintrc.json
.oxfmtrc.json
lefthook.yml
.github/workflows/test.yml
.github/dependabot.yml
.nvmrc
tsconfig.json
```

## Content pipeline

**Why two pipelines.** `@content-collections/mdx` renders on the server with `new Function(...)` (verified in `packages/mdx/src/react/server.tsx`). Cloudflare Workers forbids that. So content-collections handles metadata only, and Vite compiles MDX bodies into real modules.

1. **Collection (`content-collections.ts`)**
   - Reads `content/posts/**/*.mdx`.
   - The frontmatter schema (Zod) covers `title` (string), `description` (string), `date` (ISO date string, `z.iso.date()`), `draft` (boolean, default `false`) and `tags` (string array, default `[]`).
   - Computed fields: `locale` (first path segment, must be a supported locale), `slug` (file name without extension), and `filePath` (the key into the MDX module map).
   - Drafts are listed only in dev (`import.meta.env.DEV`); production hides their metadata.
   - Draft bodies are also kept out of production chunks: `vite/exclude-drafts.ts` (`apply: 'build'`, `enforce: 'pre'`, placed before the MDX plugin) replaces any `content/posts/**/*.mdx` whose frontmatter sets `draft: true` with an empty document, using `isDraftMdx()` from `src/content/drafts.ts`.
   - Invalid frontmatter fails the dev server and the build.
2. **MDX bodies (`src/content/mdx.ts`)**
   - `@mdx-js/rollup` is registered in `vite.config.ts` before the React plugin. `remark-frontmatter` strips the frontmatter from the compiled body; content-collections reads it separately (`parser: 'frontmatter-only'`).
   - `import.meta.glob('/content/posts/**/*.mdx')` gives a lazy map from path to module. Each post is its own chunk.
   - `preloadPostBody(filePath)` loads the chunk in the loader and caches the module's default component. `getPostBody(filePath)` returns that resolved component when cached, so SSR and prerendered HTML contain the body inline instead of a hidden Suspense segment revealed by JavaScript; otherwise it returns a cached `React.lazy` component. Either way it is stable across renders. Both throw `notFound()` for unknown paths.
3. **Source boundary (`src/content/posts.ts`)**
   - `getPosts(locale)` and `getPost(locale, slug)` are Start server functions, with Zod-validated inputs (`.validator()`; Start 1.169 removed `.inputValidator()`). They return plain JSON metadata.
   - A future CMS or database replaces only this file (plus the MDX module map). Routes and queries stay unchanged.
4. **Queries (`src/queries/posts.ts`)**
   - `queryOptions` factories for those functions, with keys `['posts', locale]` and `['post', locale, slug]`.
   - Both factories set `staleTime: 'static'`, because content only changes on deploy, so loaders and `useSuspenseQuery` share one policy. The router-level default (5 minutes) applies to other queries.
   - Errors from `notFound()` are not retried.

## Routing and locales

- **Locales:** `en` (default, no URL prefix) and `es` (`/es/...`).
- **Locale check:** `{-$locale}` is validated with `parseLocale()` in the `beforeLoad` of the `{-$locale}` layout route (`src/routes/{-$locale}/route.tsx`). A missing segment means `en`, and an unknown one throws `notFound()`. An explicit `en` prefix (`/en`, `/en/posts/...`) redirects with a 301 to the unprefixed URL, so default-locale pages have one address.
- **Post loader:**
  1. `queryClient.query(postQueryOptions(locale, slug))` (TanStack Query deprecated `ensureQueryData`). The posts index loader does the same with `postsQueryOptions(locale)`.
  2. Await `preloadPostBody(post.filePath)` so the body renders without suspending.
  3. Render with `useSuspenseQuery` plus `getPostBody(post.filePath)`, passing `components={mdxComponents}`. The `<Body />` render has one justified `react/static-components` lint disable, because the component is cached and stable. The `<Suspense>` boundary stays for cases where the body is not preloaded yet (such as hydration).
- **Missing translation:** if a post doesn't exist in `es` but exists in `en`, show the English post with a "not available in Spanish" notice instead of a 404. `getPost` returns `{ post, fallback: boolean }`. The fallback `<article>` gets `lang` set to the post's locale (`en`), while the notice keeps the page language.
- **Head:** the root route sets the site title and `lang` on `<html>`; only the post route overrides the title and adds a description, through the Router's `head`.
- **Prerendering:** Start's prerender config lists `/`, `/es`, `/posts` and `/es/posts`; posts are found by crawling links (`crawlLinks: true`, `failOnError: true`). The config doesn't read the filesystem. Everything else is SSR.

## UI and theming

- **shadcn:** initialized with the React Aria base and Tailwind v4 in CSS-first mode. Tokens are CSS variables in `@theme` in `src/styles/app.css`.
- **Components:** only what the skeleton uses (`Button`, possibly `Link`).
- **Base styling:** neutral palette, system font stack, readable prose width.
- **Post typography:** `@tailwindcss/typography` via `prose prose-neutral dark:prose-invert`.
- **Theme values:** the `theme` cookie holds `light`, `dark` or `system` (default `system`). The theme is a `data-theme` attribute on `<html>`, not a `.dark` class.
- **Colors:** each token is a single `light-dark()` value in `src/styles/app.css`. `color-scheme` picks the side: `light dark` on `:root` (system), forced by `[data-theme='light']` and `[data-theme='dark']`.
- **Tailwind dark variant:** a block `@custom-variant dark` covering `data-theme='dark'`, and `data-theme='system'` inside `@media (prefers-color-scheme: dark)`.
- **`system` mode:** needs no JavaScript.
- **Cookie:** written in the browser by `persistTheme` (`src/lib/theme-env.ts`), which also updates `data-theme`.
- **Server render:** the root `beforeLoad` reads the cookie via `getTheme` (`createIsomorphicFn`) for SSR pages. Prerendered pages are built with `system`, and a `ScriptOnce` inline script applies the cookie before first paint.
- **Toggle:** `ThemeToggle` is presentational. `ThemeSwitcher` wraps it in `ClientOnly`, so its label never mismatches during hydration.

## Error handling

| Case                                     | Behavior                                                  |
| ---------------------------------------- | --------------------------------------------------------- |
| Unknown locale or slug                   | `throw notFound()`, real 404 status from SSR              |
| Post missing in `es` but present in `en` | English post (`lang="en"`) plus a notice                  |
| Any route error                          | Root `errorComponent`: plain message, details only in dev |
| Not found                                | Root `notFoundComponent`: 404 page with a link home       |
| Invalid frontmatter                      | Build/dev failure via content-collections validation      |

## TypeScript

This is the user's tsconfig with a few agreed additions, marked `// added`:

```jsonc
{
	"include": ["**/*.ts", "**/*.tsx"],
	"compilerOptions": {
		"target": "ES2022",
		"jsx": "react-jsx",
		"module": "ESNext",
		"paths": {
			"@/*": ["./src/*"],
			"content-collections": ["./.content-collections/generated"], // added
		},
		"lib": ["ES2023", "DOM", "DOM.Iterable"], // added ES2023 (for toSorted, required by unicorn/no-array-sort)
		"types": ["vite/client", "node", "mdx"], // added "node" and "mdx" (needs @types/mdx)

		/* Bundler mode */
		"moduleResolution": "bundler",
		"allowImportingTsExtensions": true,
		"verbatimModuleSyntax": true,
		"noEmit": true,

		/* Linting */
		"skipLibCheck": true,
		"strict": true,
		"noUnusedLocals": true,
		"noUnusedParameters": true,
		"noFallthroughCasesInSwitch": true,
		"noUncheckedSideEffectImports": true,
		"erasableSyntaxOnly": true, // added, replaces Biome noEnum
	},
}
```

## Formatting (Oxfmt)

`.oxfmtrc.json`:

- `useTabs: true` (Biome's default indent style)
- `printWidth: 120`
- `singleQuote: true`
- `semi: false`
- `sortImports` enabled (replaces Biome `organizeImports`)
- `sortTailwindcss` enabled (replaces Biome `nursery/useSortedClasses`)
- `ignorePatterns: ["**/*.gen.ts", ".content-collections/**"]`

## Linting (Oxlint)

**Plugins:** `react`, `jsx-a11y`, `vitest`, `import`, `typescript`, `unicorn`, `oxc`.
**Categories:** `correctness` and `suspicious` at `error` (stands in for Biome's `recommended` plus the project, react and test domains).
**Also:** `react/react-in-jsx-scope` is off (new JSX transform). An override on `src/**` sets `no-restricted-imports` to ban Node built-ins (see the stack rule above).
**Type-aware mode:** on (`"options": { "typeAware": true }` in `.oxlintrc.json`), needed for the rules marked (TA).
**Ignored:** `**/*.gen.ts`, `.content-collections/**`.

### Direct mappings (47)

Severity is `error` unless noted.

| Biome                                           | Oxlint                                                 |
| ----------------------------------------------- | ------------------------------------------------------ |
| a11y/noNoninteractiveElementInteractions (warn) | jsx-a11y/no-noninteractive-element-interactions (warn) |
| complexity/noUselessCatchBinding                | unicorn/prefer-optional-catch-binding                  |
| complexity/noUselessStringConcat                | eslint/no-useless-concat                               |
| complexity/noUselessUndefined                   | unicorn/no-useless-undefined                           |
| nursery/noShadow                                | eslint/no-shadow                                       |
| nursery/noUnnecessaryConditions                 | typescript/no-unnecessary-condition (TA)               |
| performance/noAwaitInLoops                      | eslint/no-await-in-loop                                |
| performance/noBarrelFile                        | oxc/no-barrel-file                                     |
| style/noInferrableTypes                         | typescript/no-inferrable-types                         |
| style/noNegationElse                            | eslint/no-negated-condition                            |
| style/noNestedTernary                           | eslint/no-nested-ternary                               |
| style/noParameterAssign                         | eslint/no-param-reassign                               |
| style/noSubstr                                  | unicorn/prefer-string-slice                            |
| style/noUselessElse                             | eslint/no-else-return                                  |
| style/noYodaExpression                          | eslint/yoda                                            |
| style/useAsConstAssertion                       | typescript/prefer-as-const                             |
| style/useCollapsedElseIf                        | eslint/no-lonely-if                                    |
| style/useCollapsedIf                            | unicorn/no-lonely-if                                   |
| style/useConsistentArrayType                    | typescript/array-type (`default: "array"`)             |
| style/useConsistentArrowReturn                  | eslint/arrow-body-style                                |
| style/useConsistentBuiltinInstantiation         | unicorn/new-for-builtins                               |
| style/useConsistentCurlyBraces                  | react/jsx-curly-brace-presence                         |
| style/useConsistentObjectDefinitions            | eslint/object-shorthand                                |
| style/useConsistentTypeDefinitions (`type`)     | typescript/consistent-type-definitions (`"type"`)      |
| style/useDefaultParameterLast                   | eslint/default-param-last                              |
| style/useDefaultSwitchClause                    | eslint/default-case                                    |
| style/useExplicitLengthCheck                    | unicorn/explicit-length-check                          |
| style/useFragmentSyntax                         | react/jsx-fragments                                    |
| style/useGroupedAccessorPairs                   | eslint/grouped-accessor-pairs                          |
| style/useNumericSeparators                      | unicorn/numeric-separators-style                       |
| style/useObjectSpread                           | eslint/prefer-object-spread                            |
| style/useSelfClosingElements                    | react/self-closing-comp                                |
| style/useSingleVarDeclarator                    | eslint/one-var (`"never"`)                             |
| style/useSymbolDescription                      | eslint/symbol-description                              |
| style/useTrimStartEnd                           | unicorn/prefer-string-trim-start-end                   |
| suspicious/noAlert (warn)                       | eslint/no-alert (warn)                                 |
| suspicious/noConsole (warn)                     | eslint/no-console (warn)                               |
| suspicious/noConstantBinaryExpressions          | eslint/no-constant-binary-expression                   |
| suspicious/noDeprecatedImports (warn)           | typescript/no-deprecated (warn, TA)                    |
| suspicious/noDuplicateTestHooks                 | vitest/no-duplicate-hooks                              |
| suspicious/noEmptySource                        | unicorn/no-empty-file                                  |
| suspicious/noExplicitAny                        | typescript/no-explicit-any                             |
| suspicious/noImportCycles                       | import/no-cycle                                        |
| suspicious/noUnassignedVariables                | eslint/no-unassigned-vars                              |
| suspicious/noUnusedExpressions                  | eslint/no-unused-expressions                           |
| suspicious/noVar                                | eslint/no-var                                          |
| suspicious/useAwait (warn)                      | eslint/require-await (warn)                            |

### Not mapped directly (accepted)

| Biome                                | Handling                                     |
| ------------------------------------ | -------------------------------------------- |
| style/noEnum                         | `erasableSyntaxOnly` in tsconfig             |
| correctness/noUndeclaredVariables    | Covered by `tsc`; `no-undef` not enabled     |
| performance/noDelete                 | Partial: typescript/no-dynamic-delete        |
| performance/noReExportAll            | Partial: oxc/no-barrel-file                  |
| style/noUnusedTemplateLiteral        | Not covered                                  |
| correctness/noUndeclaredDependencies | Not covered (Knip later)                     |
| correctness/noReactPropAssignments   | Not covered                                  |
| correctness/useUniqueElementIds      | Not covered                                  |
| nursery/useSortedClasses             | Oxfmt `sortTailwindcss`                      |
| `javascript.globals: ["vi"]`         | Dropped; Vitest APIs are imported explicitly |

## Testing

**Vitest (`vitest.config.ts`).** There are two projects:

- `unit`: Node environment, for `src/**/*.test.ts`.
- `browser`: browser mode with the Playwright provider (Chromium, headless in CI), for `src/**/*.test.tsx`.

Tests use `vitest-browser-react` for `render`, `page` and `userEvent` from `vitest/browser`, and `expect.element` matchers. Everything is imported explicitly.

Initial tests:

- `parseLocale()` handles valid, missing and unknown locales.
- `selectPosts()`/`selectPost()` filter by locale and draft status, order newest first (ties by slug), and fall back to English.
- `isDraftMdx()` only matches `draft: true` inside the leading frontmatter (including CRLF files).
- The theme toggle renders, cycles through values, and calls `onThemeChange` (mocked).
- A sample MDX post renders with its custom component.

**Playwright (`playwright.config.ts`).** Tests run against the production build: `webServer` runs `bun run build && bun run preview`. Locally the reporter is `list`; in CI it is `github` plus `html` (`open: 'never'`), and on failure the workflow uploads `playwright-report` and `test-results` as an artifact.

Specs in `e2e/`:

- Home renders.
- The posts list links to the post, and the post body renders, including the custom component.
- With JavaScript disabled, `/posts/hello-world` still shows the MDX body (it is in the HTML).
- `/es/posts/hello-world` serves the Spanish post.
- `/es/posts/only-in-english` shows the English post with the notice, and the `article` has `lang="en"`.
- `/en/posts/hello-world` ends at `/posts/hello-world`, and `/en` responds with 301.
- `/posts/does-not-exist` and `/xx` respond with status 404.
- The theme persists across a reload, and the server response's `<html>` already has `data-theme="dark"` (no flash).
- Axe (`@axe-core/playwright`) runs on each visited page in light and dark mode, and fails on `serious` and `critical` violations.

## Tooling

**`package.json` scripts:** `dev`, `build`, `preview`, `test` (vitest run), `test:e2e` (playwright test), `lint` (oxlint), `format` (oxfmt), `typecheck` (tsc --noEmit).

**`lefthook.yml`, pre-commit, in parallel:**

- `oxfmt` on staged files, with fixes re-staged (`stage_fixed: true`).
- `oxlint` (type-aware via config) on staged files.
- `bun run typecheck` (`tsc --noEmit`) on the whole project.

**`.github/workflows/test.yml`** runs on push to `main` and on pull requests:

1. Set up Node from `.nvmrc`.
2. Set up Bun.
3. `bun install --frozen-lockfile`.
4. Install Playwright Chromium (not cached; Playwright advises against caching browsers).
5. `bun run test`.
6. `bun run test:e2e`.

It runs no lint or type checks; those happen in the hook.

**`.github/dependabot.yml`:** weekly updates for `bun` and `github-actions`, with minor and patch updates grouped.

**Preview:** `bun run preview` runs `srvx` on port 4173. `bunfig.toml` pins the public npm registry.

**Accepted gap:** Dependabot pull requests and `--no-verify` commits skip the hook, so they get tests only.

## Success criteria

- `bun run dev` serves home, the posts list and the post page in `en` and `es`, and the theme toggle works without a flash of the wrong theme.
- `bun run build` prerenders the post routes, and the output has no `new Function`/`eval` from MDX rendering.
- `bun run test` and `bun run test:e2e` pass locally and in CI, including the axe checks.
- A commit with a lint, format or type error is blocked by Lefthook.
- App code under `src/` imports no Node built-ins.
