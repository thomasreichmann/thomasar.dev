import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
    // Set once, so every page below can give `alternates.canonical` and the OG
    // image a path relative to the site root instead of an absolute URL.
    metadataBase: new URL(site.url),
    title: {
        default: site.title,
        template: `%s — ${site.name}`,
    },
    description: site.description,
    // Deliberately no `canonical` here. Metadata merges down the tree, so a
    // canonical set at the root is inherited by every page that does not set
    // its own, which points the whole site at `/`. Each route declares its own.
    alternates: {
        types: { 'application/rss+xml': '/feed.xml' },
    },
    openGraph: {
        type: 'website',
        siteName: site.name,
        locale: site.locale,
        url: '/',
    },
    twitter: { card: 'summary_large_image' },
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className="mx-auto flex min-h-dvh max-w-2xl flex-col px-6">
                <header className="flex items-baseline justify-between py-10">
                    <Link href="/" className="font-medium">
                        {site.name}
                    </Link>
                    <nav className="text-ink-muted flex gap-5 text-sm">
                        <Link href="/blog" className="hover:text-ink">
                            Writing
                        </Link>
                        <a
                            href={site.author.github}
                            className="hover:text-ink"
                            rel="me noreferrer"
                            target="_blank"
                        >
                            GitHub
                        </a>
                    </nav>
                </header>

                <main className="flex-1">{children}</main>

                <footer className="text-ink-muted border-rule mt-20 border-t py-8 text-sm">
                    <a href="/feed.xml" className="hover:text-ink">
                        RSS
                    </a>
                </footer>
                <Analytics />
            </body>
        </html>
    );
}
