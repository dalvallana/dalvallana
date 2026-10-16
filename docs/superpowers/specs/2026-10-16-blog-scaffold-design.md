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
- Tailwind v4, shadcn using the React Aria base, and light and dark themes via a cookie.
- Zod 4 for frontmatter, env vars, and route and server function inputs.
- Vitest browser mode (Playwright provider), Playwright e2e tests, and axe accessibility checks.
- Oxlint and Oxfmt configured from the existing Biome rules (mapping below).
- tsgo for type-checking, using the user's tsconfig plus three agreed additions.
- Lefthook pre-commit, GitHub Actions running the tests, and Dependabot.

**Out of scope (later)**

Visual design, CMS or database, i18n library for UI strings, analytics, error monitoring, the hosting adapter, RSS, sitemap, image optimization, Knip.

## Stack and runtime

| Concern                         | Choice                                                                                    |
| ------------------------------- | ----------------------------------------------------------------------------------------- |
| Package manager / script runner | Bun (`packageManager` pinned in `package.json`)                                           |
| Runtime (dev, test, build)      | Node LTS (pinned in `.nvmrc`)                                                             |
| Framework                       | TanStack Start, Router, Query                                                             |
| Content                         | content-collections (frontmatter) + `@mdx-js/rollup` (MDX bodies)                         |
| UI                              | shadcn (React Aria base: `react-aria-components`), Tailwind v4, `@tailwindcss/typography` |
| Validation                      | Zod 4                                                                                     |
| Types                           | TypeScript 7 (`tsgo`; `@typescript/native-preview` if 7.0 stable is not out)              |
| Unit/component tests            | Vitest browser mode, Playwright provider, `vitest-browser-react`                          |
| E2E                             | Playwright, `@axe-core/playwright`                                                        |
| Lint / format                   | Oxlint (type-aware), Oxfmt                                                                |
| Git hooks                       | Lefthook                                                                                  |
| CI                              | GitHub Actions (tests only)                                                               |
| Dependency updates              | Dependabot                                                                                |

**Rule: no runtime-only Node APIs in app code.** Cloudflare Workers is a likely deploy target. App code must not use `fs`, `path` or similar at request time. Build-time tooling (Vite plugins, content-collections config) may use them.

## Project layout

```
content/
  posts/
    en/hello-world.mdx
    es/hello-world.mdx
src/
  routes/
    __root.tsx                 # html shell, head, theme class, error/notFound components
    {-$locale}/
      index.tsx                # home
      posts/index.tsx          # posts list
      posts/$slug.tsx          # post page
  content/
    posts.ts                   # source boundary: getPosts(locale), getPost(locale, slug)
    mdx.ts                     # import.meta.glob map of MDX bodies (lazy)
  queries/
    posts.ts                   # postsQueryOptions(locale), postQueryOptions(locale, slug)
  components/
    ui/                        # shadcn (React Aria) components
    mdx/                       # components available inside posts + mdxComponents map
  lib/
    i18n.ts                    # locales, default locale, parseLocale()
    theme.ts                   # theme cookie server functions
  styles/app.css               # Tailwind entry, @theme tokens, dark variant
  env.ts                       # Zod-validated env
  router.tsx                   # createRouter + setupRouterSsrQueryIntegration
content-collections.ts
e2e/
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
   - The frontmatter schema (Zod) covers `title` (string), `description` (string), `date` (coerced date), `draft` (boolean, default `false`) and `tags` (string array, default `[]`).
   - Computed fields: `locale` (first path segment, must be a supported locale), `slug` (file name without extension), and `filePath` (the key into the MDX module map).
   - Drafts are excluded in production builds.
   - Invalid frontmatter fails the dev server and the build.
2. **MDX bodies (`src/content/mdx.ts`)**
   - `@mdx-js/rollup` is registered in `vite.config.ts` before the React plugin. `remark-frontmatter` and `remark-mdx-frontmatter` strip the frontmatter from the compiled body.
   - `import.meta.glob('/content/posts/**/*.mdx')` gives a lazy map from path to module. Each post is its own chunk.
   - `loadPostBody(filePath)` returns the module's default component and throws `notFound()` for unknown paths.
3. **Source boundary (`src/content/posts.ts`)**
   - `getPosts(locale)` and `getPost(locale, slug)` are Start server functions, with Zod-validated inputs. They return plain JSON metadata.
   - A future CMS or database replaces only this file (plus the MDX module map). Routes and queries stay unchanged.
4. **Queries (`src/queries/posts.ts`)**
   - `queryOptions` factories for those functions, with keys `['posts', locale]` and `['post', locale, slug]`.
   - Default `staleTime` is 5 minutes; content only changes on deploy.
   - Errors from `notFound()` are not retried.

## Routing and locales

- **Locales:** `en` (default, no URL prefix) and `es` (`/es/...`).
- **Locale check:** `{-$locale}` is validated in `beforeLoad` with `parseLocale()`. A missing segment means `en`, and an unknown one throws `notFound()`.
- **Post loader:**
  1. `queryClient.ensureQueryData(postQueryOptions(locale, slug))`.
  2. Preload the body via `loadPostBody(post.filePath)`.
  3. Render with `useSuspenseQuery` plus the loaded body component, passing `components={mdxComponents}`.
- **Missing translation:** if a post doesn't exist in `es` but exists in `en`, show the English post with a "not available in Spanish" notice instead of a 404. `getPost` returns `{ post, fallback: boolean }`.
- **Head:** set per route through the Router's `head` (title, description, `lang` on `<html>`).
- **Prerendering:** Start's prerender config covers `/`, the posts indexes, and every post in every locale. Everything else is SSR.

## UI and theming

- **shadcn:** initialized with the React Aria base and Tailwind v4 in CSS-first mode. Tokens are CSS variables in `@theme` in `src/styles/app.css`.
- **Components:** only what the skeleton uses (`Button`, possibly `Link`).
- **Base styling:** neutral palette, system font stack, readable prose width.
- **Post typography:** `@tailwindcss/typography`, with its colors bound to the theme tokens.
- **Theme values:** the `theme` cookie holds `light`, `dark` or `system` (default `system`).
- **Server render:** the root `beforeLoad` reads the cookie through a server function. The root sets `class="dark"` on `<html>` when the theme is `dark`.
- **`system` mode:** a single inline `<head>` script applies the class from `prefers-color-scheme` before first paint.
- **Toggle:** calls a server function that sets the cookie, then runs `router.invalidate()`.
- **Tailwind dark variant:** `@custom-variant dark (&:where(.dark, .dark *));`

## Error handling

| Case                                     | Behavior                                                  |
| ---------------------------------------- | --------------------------------------------------------- |
| Unknown locale or slug                   | `throw notFound()`, real 404 status from SSR              |
| Post missing in `es` but present in `en` | English post plus a notice                                |
| Any route error                          | Root `errorComponent`: plain message, details only in dev |
| Not found                                | Root `notFoundComponent`: 404 page with a link home       |
| Invalid frontmatter                      | Build/dev failure via content-collections validation      |
| Invalid env                              | `src/env.ts` throws at server start                       |

## TypeScript

This is the user's tsconfig with three agreed additions, marked `// added`:

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
		"lib": ["ES2022", "DOM", "DOM.Iterable"],
		"types": ["vite/client", "mdx"], // added "mdx" (needs @types/mdx)

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

Vitest browser-mode types (`expect.element`, Playwright provider) are referenced from a test-only declaration file. They are not added to `types`, so test globals stay out of app code.

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
**Type-aware mode:** on (`oxlint --type-aware`), needed for the rules marked (TA).
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
| correctness/noUndeclaredVariables    | Covered by tsgo; `no-undef` not enabled      |
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
- The theme toggle renders, cycles through values, and calls the server function (mocked).
- A sample MDX post renders with its custom component.

**Playwright (`playwright.config.ts`).** Tests run against the production build: `webServer` runs `bun run build && bun run preview`.

Specs in `e2e/`:

- Home renders.
- The posts list links to the post, and the post body renders, including the custom component.
- `/es/posts/hello-world` serves the Spanish post.
- `/posts/does-not-exist` and `/xx/` respond with status 404.
- The theme persists across a reload, and the server response's `<html>` already has the `dark` class (no flash).
- Axe (`@axe-core/playwright`) runs on each visited page in light and dark mode, and fails on `serious` and `critical` violations.

## Tooling

**`package.json` scripts:** `dev`, `build`, `preview`, `test` (vitest run), `test:e2e` (playwright test), `lint` (oxlint --type-aware), `format` (oxfmt), `typecheck` (tsgo --noEmit).

**`lefthook.yml`, pre-commit, in parallel:**

- `oxfmt` on staged files, with fixes re-staged (`stage_fixed: true`).
- `oxlint --type-aware` on staged files.
- `tsgo --noEmit` on the whole project.

**`.github/workflows/test.yml`** runs on push to `main` and on pull requests:

1. Set up Node from `.nvmrc`.
2. Set up Bun.
3. `bun install --frozen-lockfile`.
4. Install Playwright Chromium (cached).
5. `bun run test`.
6. `bun run test:e2e`.

It runs no lint or type checks; those happen in the hook.

**`.github/dependabot.yml`:** weekly updates for `npm` and `github-actions`, with minor and patch updates grouped.

**Accepted gap:** Dependabot pull requests and `--no-verify` commits skip the hook, so they get tests only.

## Success criteria

- `bun run dev` serves home, the posts list and the post page in `en` and `es`, and the theme toggle works without a flash of the wrong theme.
- `bun run build` prerenders the post routes, and the output has no `new Function`/`eval` from MDX rendering.
- `bun run test` and `bun run test:e2e` pass locally and in CI, including the axe checks.
- A commit with a lint, format or type error is blocked by Lefthook.
- App code under `src/` imports no Node built-ins.
