import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

/**
 * Posts are `app/blog/<slug>/page.mdx` files: the file is the route. `@next/mdx`
 * has no frontmatter, so each post exports a `metadata` object instead, which
 * Next also consumes directly as the page's own metadata.
 *
 * Nothing validates that export on its own, so a post missing `date` would sort
 * to an arbitrary place and never announce itself. Everything here exists to
 * turn that into a build failure.
 */

/** `(post)` is a route group, so it shapes the folder tree but not the URL. */
const BLOG_DIR = path.join(process.cwd(), 'app/blog/(post)');

export const postMetadataSchema = z.object({
    title: z.string().min(1),
    // Kept as a plain string rather than a Date: it is written by hand, it
    // sorts correctly lexicographically, and parsing it would only introduce a
    // timezone that a publication date does not have.
    date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be written as YYYY-MM-DD'),
    // Named `description`, not `summary`, because Next consumes this same
    // object as the page's own metadata. Under any other name the post would
    // render with no meta description at all.
    description: z.string().min(1),
    // Required, and checked against the slug below. Next merges metadata from
    // the root layout downward, so a post that omits this silently inherits the
    // site-wide canonical and tells search engines the entire blog is one page.
    alternates: z.object({ canonical: z.string() }),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
});

export type PostMetadata = z.output<typeof postMetadataSchema>;

export type Post = PostMetadata & {
    slug: string;
    href: string;
};

/** Newest first. Dates are `YYYY-MM-DD`, so a string compare is a date compare. */
export function sortPosts(posts: Post[]): Post[] {
    return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

/** Drafts are listed while developing and hidden everywhere else. */
export function isVisible(
    post: Post,
    isDev = process.env.NODE_ENV === 'development'
): boolean {
    return !post.draft || isDev;
}

export function parsePost(slug: string, metadata: unknown): Post {
    const href = `/blog/${slug}`;
    const parsed = postMetadataSchema.safeParse(metadata);

    if (!parsed.success) {
        const issues = parsed.error.issues
            .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
            .join('; ');
        throw new Error(
            `app/blog/(post)/${slug}/page.mdx has invalid metadata: ${issues}`
        );
    }

    if (parsed.data.alternates.canonical !== href) {
        throw new Error(
            `app/blog/(post)/${slug}/page.mdx has invalid metadata: ` +
                `alternates.canonical must be "${href}", got "${parsed.data.alternates.canonical}"`
        );
    }

    return { ...parsed.data, slug, href };
}

export function getPostSlugs(): string[] {
    if (!fs.existsSync(BLOG_DIR)) return [];

    return fs
        .readdirSync(BLOG_DIR, { withFileTypes: true })
        .filter(
            (entry) =>
                entry.isDirectory() &&
                fs.existsSync(path.join(BLOG_DIR, entry.name, 'page.mdx'))
        )
        .map((entry) => entry.name);
}

export async function getAllPosts(): Promise<Post[]> {
    const posts = await Promise.all(
        getPostSlugs().map(async (slug) => {
            const mod = await import(`../app/blog/(post)/${slug}/page.mdx`);
            return parsePost(slug, mod.metadata);
        })
    );

    return sortPosts(posts.filter((post) => isVisible(post)));
}
