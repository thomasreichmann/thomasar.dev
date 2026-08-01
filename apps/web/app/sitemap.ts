import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { site } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const posts = await getAllPosts();

    return [
        { url: site.url, lastModified: new Date() },
        { url: `${site.url}/blog`, lastModified: new Date() },
        ...posts.map((post) => ({
            url: `${site.url}${post.href}`,
            lastModified: new Date(post.date),
        })),
    ];
}
