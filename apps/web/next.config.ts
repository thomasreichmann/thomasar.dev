import createMDX from '@next/mdx';
import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
    // `.mdx` files under app/ become routes. Posts live at
    // app/blog/<slug>/page.mdx and the file itself is the page.
    pageExtensions: ['ts', 'tsx', 'mdx'],
    // Pin the workspace root. Git worktrees carry their own pnpm-lock.yaml, so
    // Next's lockfile inference finds two candidates and warns on every build.
    turbopack: {
        root: path.join(__dirname, '../..'),
    },
};

const withMDX = createMDX({
    // Deliberately the JS pipeline, not `experimental.mdxRs`. The Rust MDX
    // compiler cannot run JS remark/rehype plugins, and shiki highlighting is
    // one, so mdxRs silently drops highlighting rather than failing loudly.
    //
    // Plugins are named as strings, not imported. Turbopack passes loader
    // options across a serialization boundary and rejects a function outright
    // ("does not have serializable options"), so it resolves the names itself.
    options: {
        remarkPlugins: [['remark-gfm', {}]],
        rehypePlugins: [
            [
                'rehype-pretty-code',
                {
                    // Both themes are emitted at build time and switched in
                    // CSS, so there is no highlight flash and no client JS.
                    theme: { light: 'github-light', dark: 'github-dark' },
                    defaultLang: 'plaintext',
                },
            ],
        ],
    },
});

export default withMDX(nextConfig);
