import Link from 'next/link';

/**
 * `(post)` is a route group, so it adds nothing to the URL: a post at
 * app/blog/(post)/some-slug/page.mdx still serves from /blog/some-slug. The
 * group exists only so this wrapper applies to posts and not to the /blog
 * listing, which sits outside it.
 */
export default function PostLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <article className="prose">{children}</article>
            <Link
                href="/blog"
                className="text-ink-muted hover:text-ink mt-16 inline-block text-sm"
            >
                ← All writing
            </Link>
        </>
    );
}
