import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = {
    title: 'Writing',
    description: 'Posts on build systems, performance, and upstream bugs.',
    alternates: { canonical: '/blog' },
};

export default async function BlogIndexPage() {
    const posts = await getAllPosts();

    return (
        <div className="flex flex-col gap-10">
            <h1 className="text-2xl font-medium tracking-tight">Writing</h1>

            {posts.length === 0 ? (
                <p className="text-ink-muted">Nothing published yet.</p>
            ) : (
                <ul className="flex flex-col gap-8">
                    {posts.map((post) => (
                        <li key={post.slug}>
                            <Link href={post.href} className="group">
                                <h2 className="font-medium group-hover:underline">
                                    {post.title}
                                    {post.draft && (
                                        <span className="text-ink-muted ml-2 text-xs font-normal">
                                            draft
                                        </span>
                                    )}
                                </h2>
                                <p className="text-ink-muted mt-1 text-sm">
                                    {post.description}
                                </p>
                                <time
                                    dateTime={post.date}
                                    className="text-ink-muted mt-2 block text-xs"
                                >
                                    {post.date}
                                </time>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
