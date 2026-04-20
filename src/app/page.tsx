import { Metadata } from 'next';
import { query } from '@/lib/db';
import { getTopDeals, getVerifiedCoupons } from '@/lib/ranking';
import Link from 'next/link';
import styles from './page.module.css';

export const revalidate = 1800;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Aussie Dealz - Verified Coupons & Deals Australia',
    description: 'Save money with verified Australian promo codes and daily deals from top local stores.',
    keywords: 'australia coupons, promo codes, discounts, deals, aussie dealz',
    alternates: { canonical: '/' },
    openGraph: {
      title: 'Aussie Dealz - Verified Coupons & Deals Australia',
      description: 'Save money with verified coupons from top Australian stores.',
      type: 'website',
      url: '/',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Aussie Dealz - Verified Coupons & Deals Australia',
      description: 'Save money with verified coupons from top Australian stores.',
    },
  };
}

async function getTopStores() {
  try {
    return await query<{
      id: number;
      name: string;
      slug: string;
      logo_url: string | null;
    }>(
      `SELECT id, name, slug, logo_url
       FROM advertisers
       WHERE status = 'active' AND logo_url IS NOT NULL
       ORDER BY RAND()
       LIMIT 16`
    );
  } catch {
    return [];
  }
}

async function getRandomBanners() {
  try {
    return await query<{
      id: number;
      image_url: string | null;
    }>(
      `SELECT c.id, c.image_url
       FROM creatives c
       JOIN advertisers a ON c.advertiser_id = a.id
       WHERE c.image_url IS NOT NULL AND a.status = 'active'
       ORDER BY RAND()
       LIMIT 8`
    );
  } catch {
    return [];
  }
}

export default async function Home() {
  const [topDeals, topStores, bestCoupons, banners] = await Promise.all([
    getTopDeals(8),
    getTopStores(),
    getVerifiedCoupons(8),
    getRandomBanners(),
  ]);

  const categoryLinks = [
    { slug: 'fashion', name: 'Fashion' },
    { slug: 'beauty', name: 'Beauty' },
    { slug: 'electronics', name: 'Electronics' },
    { slug: 'home', name: 'Home & Garden' },
    { slug: 'sports', name: 'Sports' },
    { slug: 'food', name: 'Food & Dining' },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'Aussie Dealz',
        url: 'https://aussiedealz.com',
        logo: 'https://aussiedealz.com/logo.png',
        sameAs: [
          process.env.NEXT_PUBLIC_BRAND_LINKEDIN || 'https://www.linkedin.com/company/aussiedealz',
          process.env.NEXT_PUBLIC_BRAND_X || 'https://x.com/aussiedealz',
          process.env.NEXT_PUBLIC_BRAND_GITHUB || 'https://github.com/abazaid/commissssio',
        ],
        contactPoint: [{ '@type': 'ContactPoint', contactType: 'customer support', email: 'hello@aussiedealz.com' }],
      },
      {
        '@type': 'WebSite',
        name: 'Aussie Dealz',
        url: 'https://aussiedealz.com',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://aussiedealz.com/search?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Are coupons on Aussie Dealz verified?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. We run scheduled feed updates and editorial checks, and we remove stale promotions when validity signals fail.',
            },
          },
          {
            '@type': 'Question',
            name: 'How often are deals updated?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Deals are refreshed on a recurring schedule, with visible update dates shown on key listing pages to support freshness.',
            },
          },
          {
            '@type': 'Question',
            name: 'Which Australian stores have the best coupon codes?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Top stores vary by season and category, but our ranked listings prioritize reliability and current conversion-oriented signals.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is the difference between GET CODE and VIEW DEAL?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'GET CODE means you copy and apply a coupon at checkout, while VIEW DEAL links to a promotion that is usually auto-applied or already discounted.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I report an expired coupon?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Use our contact page to report broken or expired listings so we can re-test and clean affected offers quickly.',
            },
          },
        ],
      },
    ],
  };
  const generatedAt = new Date().toISOString().split('T')[0];
  const formatDate = (value?: Date | string | null) =>
    value ? new Date(value).toISOString().split('T')[0] : null;
  const resolveUpdatedDate = (item: { updated_at?: Date | string | null; created_at?: Date | string | null }) =>
    formatDate(item.updated_at || item.created_at) || generatedAt;
  const sectionLastUpdated = [
    ...topDeals.map((deal) => resolveUpdatedDate(deal)),
    ...bestCoupons.map((coupon) => resolveUpdatedDate(coupon)),
  ].sort().reverse()[0] || generatedAt;
  const comparisonRows = topDeals.slice(0, 6).map((deal) => ({
    name: deal.advertiser_name,
    dealType: deal.coupon_code ? 'Coupon Code' : 'Direct Deal',
    coupon: deal.coupon_code ? 'Yes' : 'No',
    updated: resolveUpdatedDate(deal),
  }));

  return (
    <main className={styles.main}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className={styles.hero}>
        <h1>Aussie Dealz: Australian Coupons & Deals</h1>
        <p>Save money with verified coupons from top stores in Australia</p>

        <form action="/search" method="GET" className={styles.searchForm}>
          <input
            type="text"
            name="q"
            placeholder="Search for stores or coupons..."
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>Search</button>
        </form>
      </section>

      {banners.length > 0 && (
        <section className={styles.section}>
          <h2>Hot Deals Today</h2>
          <div className={styles.bannerCarousel}>
            {banners.map((banner) => (
              <Link
                key={banner.id}
                href={`/api/click?creative_id=${banner.id}&sub_id=homepage_banner_${banner.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.bannerCard}
              >
                {banner.image_url && <img src={banner.image_url} alt="Banner" />}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className={styles.section}>
        <h2>Trending Deals</h2>
        <p>Last updated: {sectionLastUpdated}</p>
        <div className={styles.grid}>
          {topDeals.length > 0 ? topDeals.map((deal) => (
            <Link
              key={deal.id}
              href={`/store/${deal.advertiser_slug}`}
              className={styles.card}
            >
              <div className={styles.cardBadge}>HOT</div>
              {deal.logo_url && <img src={deal.logo_url} alt={deal.advertiser_name} />}
              <h3>{deal.title}</h3>
              <p className={styles.storeName}>{deal.advertiser_name}</p>
              <p className={styles.storeName}>Updated: {resolveUpdatedDate(deal)}</p>
              {deal.coupon_code ? (
                <span className={styles.couponCode}>{deal.coupon_code}</span>
              ) : (
                <span className={styles.viewDeal}>VIEW DEAL</span>
              )}
            </Link>
          )) : (
            <div className={styles.emptyState}>
              <p>No active deals available. Check latest offers below.</p>
            </div>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Top Stores</h2>
        <div className={styles.storesGrid}>
          {topStores.map((store) => (
            <Link
              key={store.id}
              href={`/store/${store.slug}`}
              className={styles.storeCard}
            >
              {store.logo_url && <img src={store.logo_url} alt={store.name} />}
              <span>{store.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Best Verified Coupons</h2>
        <p>Last updated: {sectionLastUpdated}</p>
        <div className={styles.grid}>
          {bestCoupons.length > 0 ? bestCoupons.map((coupon) => (
            <Link
              key={coupon.id}
              href={`/store/${coupon.advertiser_slug}`}
              className={styles.card}
            >
              <div className={styles.cardBadge}>VERIFIED</div>
              <h3>{coupon.title}</h3>
              <p className={styles.storeName}>{coupon.advertiser_name}</p>
              <p className={styles.storeName}>Updated: {resolveUpdatedDate(coupon)}</p>
              {coupon.coupon_code && <span className={styles.couponCode}>{coupon.coupon_code}</span>}
            </Link>
          )) : (
            <div className={styles.emptyState}>
              <p>No verified coupons available.</p>
            </div>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Categories</h2>
        <div className={styles.categoriesGrid}>
          {categoryLinks.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}-coupons`}
              className={styles.categoryCard}
            >
              <span className={styles.categoryName}>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.seoContent}>
        <h2>How to Find the Best Coupons in Australia</h2>
        <p>
          Looking for the best deals and discounts in Australia? Our platform aggregates verified
          coupons from top Australian stores including fashion, beauty, electronics, and more.
          We manually verify each coupon code to ensure it works, saving you time and money.
        </p>
        <p>
          Whether you are shopping at The Iconic, MYER, or Chemist Warehouse, find exclusive
          promo codes and discounts updated daily. Our verified coupons can save you up to 70%
          on your next purchase.
        </p>
        <p>
          <strong>How to use coupons:</strong> Click &quot;GET CODE&quot;, copy the code, and paste it at checkout.
          Verified coupons are marked with a VERIFIED badge and show social proof when available.
        </p>
        <h2>What is the best coupon site in Australia?</h2>
        <p>
          The best coupon site is one that combines fresh listings, transparent dates, and clear offer mechanics. Aussie Dealz focuses on verified Australian
          promotions, practical checkout guidance, and category-level pages that make active savings opportunities easier to compare.
        </p>
        <h3>Are coupons on Aussie Dealz verified?</h3>
        <p>
          Yes. We run scheduled syncs and editorial checks to reduce stale listings. Verified-style offers are monitored for validity and removed when campaign
          signals indicate they are no longer reliable.
        </p>
        <h3>How often are deals updated?</h3>
        <p>
          Key pages are updated continuously through scheduled refresh jobs and visible page-level freshness timestamps. This helps shoppers evaluate whether
          a listing is recent before attempting redemption.
        </p>
        <h3>Which Australian stores usually have strong coupon activity?</h3>
        <p>
          Coupon activity shifts by season, but fashion, beauty, and selected lifestyle stores frequently offer recurring code opportunities. Electronics
          merchants often alternate between code campaigns and direct markdowns.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Top Stores Comparison Snapshot</h2>
        <p>Quick comparison of currently visible high-interest stores and offer mechanics.</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ddd' }}>Store</th>
                <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ddd' }}>Top Offer Type</th>
                <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ddd' }}>Coupon Available</th>
                <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ddd' }}>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, idx) => (
                <tr key={`${row.name}-${idx}`}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{row.name}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{row.dealType}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{row.coupon}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{row.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.faqSection}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqItem}>
          <h3>Are coupons on Aussie Dealz verified?</h3>
          <p>Yes. We combine scheduled feed updates with editorial checks and remove stale offers when campaign confidence drops.</p>
        </div>
        <div className={styles.faqItem}>
          <h3>How often are deals updated?</h3>
          <p>Deals are refreshed frequently with visible freshness signals on key pages so shoppers can prioritize current listings.</p>
        </div>
        <div className={styles.faqItem}>
          <h3>What should I do if a code fails?</h3>
          <p>Try one alternate listing from the same store page, then report the issue via contact so the team can re-test and clean listings.</p>
        </div>
        <div className={styles.faqItem}>
          <h3>Do you only list coupon codes?</h3>
          <p>No. We include both code-based offers and direct deals so you can compare whichever route gives better checkout value.</p>
        </div>
        <div className={styles.faqItem}>
          <h3>Can I discover deals by category?</h3>
          <p>Yes. Use category pages like Fashion, Beauty, and Electronics to review active stores, top offers, and current update signals.</p>
        </div>
      </section>
    </main>
  );
}

