import { getAllPosts } from '@/lib/posts';
import { site } from '@/lib/site';

/** Everything here is static, so the feed is generated once at build time. */
export const dynamic = 'force-static';

function escape(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

export async function GET() {
    const posts = await getAllPosts();

    const items = posts
        .map((post) => {
            const url = `${site.url}${post.href}`;
            return `        <item>
            <title>${escape(post.title)}</title>
            <link>${url}</link>
            <guid isPermaLink="true">${url}</guid>
            <description>${escape(post.description)}</description>
            <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
        </item>`;
        })
        .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>${escape(site.title)}</title>
        <link>${site.url}</link>
        <description>${escape(site.description)}</description>
        <language>en</language>
        <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml" />
${items}
    </channel>
</rss>
`;

    return new Response(xml, {
        headers: { 'content-type': 'application/rss+xml; charset=utf-8' },
    });
}
