# thomasar.dev

Personal site and blog. Static Next.js on the App Router, MDX posts, shiki
highlighting at build time, no database and no runtime services.

## Develop

```bash
pnpm install
pnpm dev
```

## Check

```bash
pnpm check       # lint + build + test
pnpm typecheck
```

## Write

A post is `apps/web/app/blog/(post)/<slug>/page.mdx`. See `CLAUDE.md` for the
metadata contract and `docs/ai/conventions.md` for everything else.
