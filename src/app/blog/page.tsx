import { Metadata } from 'next';
import Link from 'next/link';
import { BLOG_AUTHOR, blogPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Deals Blog',
  description: 'Weekly editorial roundup of top Australian savings trends, verification tactics, and sale calendar insights.',
  alternates: { canonical: '/blog' },
};

export default function BlogPage() {
  return (
    <main style={{ maxWidth: 980, margin: '40px auto', padding: '0 20px' }}>
      <h1>Aussie Dealz Blog</h1>
      <p style={{ lineHeight: 1.7 }}>
        Editorial coverage by {BLOG_AUTHOR.name}, {BLOG_AUTHOR.role}. Every post includes publish dates, update dates, and practical savings methodology for Australian shoppers.
      </p>

      <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
        {blogPosts.map((post) => (
          <article key={post.slug} style={{ border: '1px solid #ddd', borderRadius: 10, padding: 16 }}>
            <h2 style={{ marginTop: 0 }}>
              <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: '#111' }}>
                {post.title}
              </Link>
            </h2>
            <p style={{ margin: '8px 0' }}>{post.description}</p>
            <p style={{ margin: '8px 0', color: '#555', fontSize: 14 }}>
              By <Link href={`/authors/${BLOG_AUTHOR.slug}`}>{BLOG_AUTHOR.name}</Link> | Published: {post.publishedAt} | Updated: {post.updatedAt} | {post.readTime}
            </p>
            <p style={{ margin: '8px 0', color: '#444', fontSize: 14 }}>
              <strong>Affiliate disclosure:</strong> This article may reference affiliate-linked offers. Aussie Dealz may earn a commission from qualifying purchases.
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
