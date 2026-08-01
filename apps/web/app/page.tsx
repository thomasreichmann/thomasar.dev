import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { site } from '@/lib/site';

export const metadata: Metadata = {
    alternates: { canonical: '/' },
};

export default async function HomePage() {
    const posts = (await getAllPosts()).slice(0, 5);

    return (
        <div className="flex flex-col gap-16">
            <section className="prose">
                <p>{site.description}</p>
            </section>

            {posts.length > 0 && (
                <section>
                    <h2 className="text-ink-muted mb-6 text-sm tracking-wide uppercase">
                        Writing
                    </h2>
                    <ul className="flex flex-col gap-6">
                        {posts.map((post) => (
                            <li key={post.slug}>
                                <Link href={post.href} className="group">
                                    <h3 className="font-medium group-hover:underline">
                                        {post.title}
                                    </h3>
                                    <p className="text-ink-muted mt-1 text-sm">
                                        {post.description}
                                    </p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}
