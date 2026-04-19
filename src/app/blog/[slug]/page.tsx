import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BLOG_AUTHOR, blogPosts, getBlogPost } from '@/lib/blog';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return { title: 'Article Not Found' };
  }

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [BLOG_AUTHOR.name],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    keywords: ['Australia coupons', 'discount code', post.category, 'Aussie Dealz'],
    author: {
      '@type': 'Person',
      name: BLOG_AUTHOR.name,
      url: `https://aussiedealz.com/authors/${BLOG_AUTHOR.slug}`,
      sameAs: [
        process.env.NEXT_PUBLIC_EDITOR_LINKEDIN || 'https://www.linkedin.com/company/aussiedealz',
        process.env.NEXT_PUBLIC_EDITOR_X || 'https://x.com/aussiedealz',
      ],
    },
    publisher: {
      '@type': 'Organization',
      name: 'Aussie Dealz',
      logo: { '@type': 'ImageObject', url: 'https://aussiedealz.com/logo.png' },
      sameAs: [
        process.env.NEXT_PUBLIC_BRAND_LINKEDIN || 'https://www.linkedin.com/company/aussiedealz',
        process.env.NEXT_PUBLIC_BRAND_X || 'https://x.com/aussiedealz',
      ],
    },
    mainEntityOfPage: `https://aussiedealz.com/blog/${post.slug}`,
  };

  return (
    <main style={{ maxWidth: 900, margin: '40px auto', padding: '0 20px', lineHeight: 1.8 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <p style={{ fontSize: 14, color: '#666' }}>
        <Link href="/blog">Blog</Link> / {post.category}
      </p>
      <h1>{post.title}</h1>
      <p style={{ color: '#444' }}>
        By <Link href={`/authors/${BLOG_AUTHOR.slug}`}>{BLOG_AUTHOR.name}</Link> | Published: {post.publishedAt} | Updated: {post.updatedAt} | {post.readTime}
      </p>
      <p style={{ color: '#444', background: '#f9f9f9', padding: 12, borderRadius: 8 }}>
        <strong>Affiliate disclosure:</strong> This article may include affiliate-linked recommendations. Aussie Dealz may earn a commission from qualifying purchases.
      </p>

      {post.content.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}

      <h2>Verification Notes</h2>
      <p>
        Offer availability can change by merchant and campaign window. We recommend checking final terms on the retailer checkout page.
      </p>

      <p>
        Read our full <Link href="/methodology">verification methodology</Link>.
      </p>
    </main>
  );
}
