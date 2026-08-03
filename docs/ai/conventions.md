# Conventions

## Structure

```
apps/web/
  app/
    layout.tsx                    root shell + site-wide metadata
    page.tsx                      home
    globals.css                   theme, prose, shiki token colours
    blog/
      page.tsx                    the listing
      (post)/
        layout.tsx                article wrapper, applies .prose
        <slug>/page.mdx           one post, one route
    feed.xml/route.ts             RSS
    sitemap.ts, robots.ts
  components/                     shared TSX
  lib/
    posts.ts                      the content index
    site.ts                       site-wide constants
  mdx-components.tsx              global component map for MDX
```

## Naming

- Files are kebab-case (`post-header.tsx`), including components.
- Post slugs are kebab-case and describe the problem, not the title.
- Test files sit next to what they test (`posts.ts` → `posts.test.ts`).

## Components

- Main export first, helper components below. Enforced as a warning by the
  `local/export-default-first` rule in `eslint.config.mjs`.
- Default-export the component a file is named for; named-export the rest.

## Styling

- Tailwind utilities in TSX. Class order is enforced by
  `better-tailwindcss/enforce-canonical-classes`.
- Prose styling lives in `globals.css` under `.prose`, not in
  `mdx-components.tsx`, so MDX posts and hand-written TSX render identically.
- Light and dark both come from `prefers-color-scheme`. There is no theme
  toggle and no client-side theme JS.
- Code blocks are highlighted at build time by shiki via `rehype-pretty-code`,
  which emits both themes as CSS variables per token. Never add a client-side
  highlighter.

## MDX

- MDX plugins are configured in `next.config.ts` as **strings**, not imported
  functions. Turbopack passes loader options across a serialization boundary
  and rejects a function with "does not have serializable options".
- Do not enable `experimental.mdxRs`. The Rust MDX compiler cannot run JS
  remark/rehype plugins, so it drops shiki highlighting silently rather than
  failing.
- Components used in posts without an import must be registered in
  `mdx-components.tsx`.

## Content invariants

`lib/posts.ts` is the only thing that reads posts, and it throws rather than
degrading. A post fails the build when it has no `metadata` export, a `date`
that is not `YYYY-MM-DD`, a missing `description`, or an `alternates.canonical`
that does not equal `/blog/<slug>`. Keep it that way: a silently wrong
canonical or an unsorted post is not the kind of bug that announces itself.

## Testing

- Pure logic in `lib/` is unit-tested with vitest. IO is kept out of the tested
  functions: `parsePost`, `sortPosts` and `isVisible` take plain data, and
  `getAllPosts` is the only thing that touches the filesystem.
- There is no e2e tier. Every route is static, so `next build` succeeding is
  most of what a smoke test would assert. Add Playwright when there is
  behaviour that a build cannot prove.

## Toolchain ceilings

TypeScript is pinned below 6.1 because `typescript-eslint` (via
`eslint-config-next`) refuses to load against TS 7. Not our choice to make
until that ships. Everything else tracks latest.

ESLint runs at 10 even though `eslint-plugin-react`'s peer range stops at
`^9.7`. Its only ESLint-10 crash path is React version detection, which
`eslint.config.mjs` bypasses by pinning `settings.react.version` (comment there
has the removal criteria). The install-time peer warnings from
`eslint-plugin-react`, `eslint-plugin-import`, and `eslint-plugin-jsx-a11y`
are expected until those release ESLint-10 support; the enabled rules from all
three are verified working at runtime.
