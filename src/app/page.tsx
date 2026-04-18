import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import { getTopDeals, getVerifiedCoupons } from '@/lib/ranking';
import Link from 'next/link';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Australian Coupons & Deals | Verified Promo Codes 2026',
    description: 'Save money with verified coupons and exclusive deals from top Australian stores. Up to 70% off fashion, beauty, electronics and more.',
    keywords: 'australia coupons, promo codes, discounts, deals, save money',
    openGraph: {
      title: 'Australian Coupons & Deals | Verified Promo Codes',
      description: 'Save money with verified coupons from top Australian stores.',
      type: 'website',
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

async function getCategories() {
  try {
    return await query<{ category: string; count: number }>(
      `SELECT category, COUNT(*) as count 
       FROM offers 
       WHERE is_expired = 0 AND category IS NOT NULL 
       GROUP BY category 
       ORDER BY count DESC 
       LIMIT 6`
    );
  } catch {
    return [
      { category: 'Fashion', count: 150 },
      { category: 'Beauty', count: 100 },
      { category: 'Electronics', count: 80 },
      { category: 'Home', count: 60 },
      { category: 'Sports', count: 40 },
      { category: 'Food', count: 30 },
    ];
  }
}

async function getRandomBanners() {
  try {
    return await query<{
      id: number;
      advertiser_id: number;
      image_url: string | null;
    }>(
      `SELECT c.id, c.advertiser_id, c.image_url, a.slug as advertiser_slug
       FROM creatives c
       JOIN advertisers a ON c.advertiser_id = a.id
       WHERE c.image_url IS NOT NULL
       ORDER BY RAND()
       LIMIT 8`
    );
  } catch {
    return [];
  }
}

export default async function Home() {
  const [topDeals, topStores, bestCoupons, categories, banners] = await Promise.all([
    getTopDeals(8),
    getTopStores(),
    getVerifiedCoupons(8),
    getCategories(),
    getRandomBanners(),
  ]);

  const categoryLinks = [
    { slug: 'fashion', name: 'Fashion', icon: '👗' },
    { slug: 'beauty', name: 'Beauty', icon: '💄' },
    { slug: 'electronics', name: 'Electronics', icon: '📱' },
    { slug: 'home', name: 'Home & Garden', icon: '🏠' },
    { slug: 'sports', name: 'Sports', icon: '⚽' },
    { slug: 'food', name: 'Food & Dining', icon: '🍔' },
  ];

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1>Australian Coupons & Deals</h1>
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
          <h2>🔥 Hot Deals Today</h2>
          <div className={styles.bannerCarousel}>
            {banners.map((banner: any) => (
              <Link
                key={banner.id}
                href={`/api/click?offer_id=${banner.advertiser_id}&sub_id=homepage_banner_${banner.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.bannerCard}
              >
                {banner.image_url && (
                  <img src={banner.image_url} alt="Banner" />
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className={styles.section}>
        <h2>🔥 Trending Deals</h2>
        <div className={styles.grid}>
          {topDeals.length > 0 ? topDeals.map((deal) => (
            <Link
              key={deal.id}
              href={`/store/${deal.advertiser_slug}`}
              className={styles.card}
            >
              <div className={styles.cardBadge}>🔥 HOT</div>
              {deal.logo_url && (
                <img src={deal.logo_url} alt={deal.advertiser_name} />
              )}
              <h3>{deal.title}</h3>
              <p className={styles.storeName}>{deal.advertiser_name}</p>
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
        <h2>🏆 Top Stores</h2>
        <div className={styles.storesGrid}>
          {topStores.map((store) => (
            <Link
              key={store.id}
              href={`/store/${store.slug}`}
              className={styles.storeCard}
            >
              {store.logo_url && (
                <img src={store.logo_url} alt={store.name} />
              )}
              <span>{store.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>🎟️ Best Verified Coupons</h2>
        <div className={styles.grid}>
          {bestCoupons.length > 0 ? bestCoupons.map((coupon) => (
            <Link
              key={coupon.id}
              href={`/store/${coupon.advertiser_slug}`}
              className={styles.card}
            >
              <div className={styles.cardBadge}>✓ VERIFIED</div>
              <h3>{coupon.title}</h3>
              <p className={styles.storeName}>{coupon.advertiser_name}</p>
              {coupon.coupon_code && (
                <span className={styles.couponCode}>{coupon.coupon_code}</span>
              )}
            </Link>
          )) : (
            <div className={styles.emptyState}>
              <p>No verified coupons available.</p>
            </div>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h2>📂 Categories</h2>
        <div className={styles.categoriesGrid}>
          {categoryLinks.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}-coupons`}
              className={styles.categoryCard}
            >
              <span className={styles.categoryIcon}>{cat.icon}</span>
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
          Whether you're shopping at The Iconic, MYER, or Chemist Warehouse, find exclusive 
          promo codes and discounts updated daily. Our verified coupons can save you up to 70% 
          on your next purchase.
        </p>
        <p>
          <strong>How to use coupons:</strong> Click "GET CODE", copy the code, and paste it at checkout. 
          Verified coupons are marked with ✓ symbol and show "Used X times" for social proof.
        </p>
      </section>
    </main>
  );
}