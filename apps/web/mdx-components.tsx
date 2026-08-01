import type { MDXComponents } from 'mdx/types';
import PostHeader from '@/components/post-header';

/**
 * Global component map for every MDX file. Anything named here is in scope
 * without an import, which is what lets a post render its own metadata:
 *
 *     export const metadata = { title: '...', date: '...' }
 *
 *     <PostHeader {...metadata} />
 *
 * Prose styling deliberately lives in globals.css rather than here, so MDX
 * posts and hand-written TSX pages render identically.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        ...components,
        PostHeader,
    };
}
