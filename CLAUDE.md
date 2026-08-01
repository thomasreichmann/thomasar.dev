# CLAUDE.md

## Project Overview

`thomasar.dev` — personal site and blog. Static Next.js on the App Router, no
database, no auth, no runtime services. Posts are MDX files that compile at
build time; every route in the site prerenders.

## Commands

**REQUIRED before committing:** `pnpm check` (runs lint + build + test via Turborepo).

Run it bare — never pipe through `tail`/`grep`/`head`. Output is already
condensed for agents (one line on green, actionable-only on red); truncating it
hides the error the wrapper surfaced. Noisy output is a wrapper bug to fix, not
something to pipe around. More detail: `pnpm check --verbose`.

`pnpm typecheck` is separate from `pnpm check` and CI runs both.

## Writing a post

A post is `apps/web/app/blog/(post)/<slug>/page.mdx`. The file is the route;
`(post)` is a route group, so it shapes the folder tree but not the URL.

```mdx
export const metadata = {
    title: '...',
    date: '2026-08-14',
    description: '...',
    alternates: { canonical: '/blog/<slug>' },
    tags: ['...'],
    draft: false,
};

<PostHeader {...metadata} />
```

That object is doing two jobs: `lib/posts.ts` reads it to build the listing, the
feed, and the sitemap, and Next consumes the same object as the page's own
metadata. Which is why the field is `description` and not `summary`, and why
`alternates.canonical` is mandatory and checked against the slug at build time.
Without it the post inherits the site-wide canonical and tells search engines
the whole blog is one page.

Two things worth knowing:

- **A draft is unlisted, not unreachable.** `draft: true` hides a post from the
  listing, the feed, and the sitemap, but the file is still a route and still
  prerenders. Keep genuinely private drafts outside `app/` until they are ready.
- **URLs are permanent.** A slug is the one irreversible decision in a post.
  Renaming one discards everything it has earned. Pick it for how someone would
  search for the problem, not for how the post is titled.

## Cross-posting

When a post is syndicated to dev.to or similar, set that platform's canonical
field (`canonical_url` on dev.to) to the `thomasar.dev` URL. Without it the
copy on the higher-authority domain is the one that gets indexed. This is a
publishing-time step with no footprint in this repo.

## Required Reading

- **Before writing code:** `docs/ai/conventions.md` — naming, structure, style

## Git & Workflow

- Conventional commit messages: `feat: add rss feed (#42)`
- All non-trivial work should have a GitHub Issue before starting
- PRs reference issues: `Closes #42` or `No-Issue: <reason>` for trivial changes
