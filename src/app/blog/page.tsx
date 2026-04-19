import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Deals Blog',
  description: 'Weekly editorial roundup of top Australian savings trends, verified promo code tactics, and category deal insights.',
  alternates: { canonical: '/blog' },
};

const posts = [
  {
    slug: 'best-deals-this-week',
    title: 'Best Deals This Week in Australia',
    excerpt: 'A weekly editorial review of standout coupons, strongest price drops, and high-value retailer offers.',
  },
  {
    slug: 'how-to-check-if-a-coupon-is-real',
    title: 'How to Check if a Coupon Code Is Legit',
    excerpt: 'A practical checklist to validate promo codes before checkout and avoid fake or expired offers.',
  },
  {
    slug: 'australian-retail-sale-calendar',
    title: 'Australian Retail Sale Calendar',
    excerpt: 'Seasonal sale windows and shopping periods where discount depth is usually strongest.',
  },
];

export default function BlogPage() {
  return (
    <main style={{ maxWidth: 980, margin: '40px auto', padding: '0 20px' }}>
      <h1>Aussie Dealz Blog</h1>
      <p style={{ lineHeight: 1.7 }}>
        Our editorial team publishes practical savings guides, weekly deal roundups, and category-specific shopping advice for Australian consumers.
      </p>
      <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
        {posts.map((post) => (
          <article key={post.slug} style={{ border: '1px solid #ddd', borderRadius: 10, padding: 16 }}>
            <h2 style={{ marginTop: 0 }}>{post.title}</h2>
            <p>{post.excerpt}</p>
            <Link href="/stores">Browse live stores</Link>
          </article>
        ))}
      </div>
    </main>
  );
}
