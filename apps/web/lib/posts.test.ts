import { describe, expect, it } from 'vitest';
import { isVisible, parsePost, sortPosts, type Post } from './posts';

const valid = {
    title: 'A post',
    date: '2026-08-01',
    description: 'What it is about.',
    alternates: { canonical: '/blog/a-post' },
};

function post(overrides: Partial<Post> = {}): Post {
    return { ...parsePost('a-post', valid), ...overrides };
}

describe('parsePost', () => {
    it('fills in the optional fields', () => {
        expect(parsePost('a-post', valid)).toEqual({
            ...valid,
            tags: [],
            draft: false,
            slug: 'a-post',
            href: '/blog/a-post',
        });
    });

    it('names the file and the field when metadata is wrong', () => {
        expect(() =>
            parsePost('a-post', { ...valid, date: '01/08/2026' })
        ).toThrow(
            /app\/blog\/\(post\)\/a-post\/page\.mdx.*date: date must be written as YYYY-MM-DD/
        );
    });

    it('rejects a post with no metadata export at all', () => {
        expect(() => parsePost('a-post', undefined)).toThrow(
            /invalid metadata/
        );
    });

    it('rejects a post with no canonical, which would inherit the site-wide one', () => {
        const { title, date, description } = valid;

        expect(() => parsePost('a-post', { title, date, description })).toThrow(
            /alternates: Invalid input/
        );
    });

    it('rejects a canonical that points at a different post', () => {
        expect(() =>
            parsePost('a-post', {
                ...valid,
                alternates: { canonical: '/blog/another-post' },
            })
        ).toThrow(
            /alternates\.canonical must be "\/blog\/a-post", got "\/blog\/another-post"/
        );
    });
});

describe('sortPosts', () => {
    it('puts the newest first', () => {
        const sorted = sortPosts([
            post({ slug: 'old', date: '2025-01-02' }),
            post({ slug: 'new', date: '2026-08-01' }),
            post({ slug: 'mid', date: '2026-01-09' }),
        ]);

        expect(sorted.map((p) => p.slug)).toEqual(['new', 'mid', 'old']);
    });
});

describe('isVisible', () => {
    it('hides drafts outside development', () => {
        expect(isVisible(post({ draft: true }), false)).toBe(false);
        expect(isVisible(post({ draft: true }), true)).toBe(true);
        expect(isVisible(post({ draft: false }), false)).toBe(true);
    });
});
