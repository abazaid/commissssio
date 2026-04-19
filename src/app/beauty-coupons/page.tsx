import { Metadata } from 'next';
import Link from 'next/link';
import { getCategoryData } from '@/lib/category';
import styles from '@/app/page.module.css';

export const revalidate = 1800;

export const metadata: Metadata = {
  title: 'Beauty Coupons Australia - Verified Promo Codes',
  description: 'Find verified beauty and skincare promo codes for Australian shoppers. Updated daily with active offers.',
  alternates: { canonical: '/beauty-coupons' },
  openGraph: {
    title: 'Beauty Coupons Australia',
    description: 'Verified beauty, skincare, and cosmetics deals in Australia.',
    url: '/beauty-coupons',
  },
};

export default async function BeautyCouponsPage() {
  const { offers, stores } = await getCategoryData('beauty');
  const today = new Date().toISOString().split('T')[0];
  const parseDiscount = (text: string) => {
    const match = text.match(/(\d{1,2}(?:\.\d+)?)\s?%/);
    return match ? Number(match[1]) : null;
  };
  const summaryRows = stores.slice(0, 10).map((store) => {
    const storeOffers = offers.filter((offer) => offer.advertiser_id === store.id);
    const activeCodes = storeOffers.filter((offer) => !!offer.coupon_code).length;
    const discounts = storeOffers
      .map((offer) => parseDiscount(offer.title))
      .filter((value): value is number => value !== null);
    const averageDiscount = discounts.length > 0
      ? `${(discounts.reduce((sum, value) => sum + value, 0) / discounts.length).toFixed(1)}%`
      : 'N/A';
    const latestTimestamp = storeOffers
      .map((offer) => (offer.created_at ? new Date(offer.created_at).getTime() : 0))
      .sort((a, b) => b - a)[0];
    const lastUpdated = latestTimestamp ? new Date(latestTimestamp).toISOString().split('T')[0] : today;

    return {
      name: store.name,
      averageDiscount,
      activeCodes,
      lastUpdated,
    };
  });

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1>Beauty Coupons Australia</h1>
        <p>Save on skincare, makeup, fragrance, and wellness products with verified offers.</p>
      </section>

      <section className={styles.section}>
        <h2>Top Beauty Deals</h2>
        <div className={styles.grid}>
          {offers.length > 0 ? offers.slice(0, 18).map((offer) => (
            <Link key={offer.id} href={`/api/click?offer_id=${offer.id}&sub_id=beauty_${offer.id}`} className={styles.card}>
              <div className={styles.cardBadge}>{offer.coupon_code ? 'GET CODE' : 'VIEW DEAL'}</div>
              <h3>{offer.title}</h3>
              <p className={styles.storeName}>{offer.advertiser_name}</p>
              {offer.coupon_code && <span className={styles.couponCode}>{offer.coupon_code}</span>}
            </Link>
          )) : <p>No live beauty offers available right now.</p>}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Featured Beauty Stores</h2>
        <div className={styles.storesGrid}>
          {stores.length > 0 ? stores.map((store) => (
            <Link key={store.id} href={`/store/${store.slug}`} className={styles.storeCard}>
              {store.logo_url && <img src={store.logo_url} alt={store.name} />}
              <span>{store.name}</span>
            </Link>
          )) : <p>Store list is updating. Check back shortly.</p>}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Top Verified Beauty Stores Comparison</h2>
        <p>Snapshot of active beauty store promotions, code availability, and freshness.</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ddd' }}>Store</th>
                <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ddd' }}>Average Discount</th>
                <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ddd' }}>Active Codes</th>
                <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ddd' }}>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {summaryRows.map((row, index) => (
                <tr key={`${row.name}-${index}`}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{row.name}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{row.averageDiscount}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{row.activeCodes}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{row.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.seoContent}>
        <h2>Beauty Savings Strategy for Australian Shoppers</h2>
        <p>
          Beauty pricing changes frequently due to seasonal product launches, gift-with-purchase cycles, and flash campaign windows.
          We track active beauty promotions from Australian affiliate feeds and surface opportunities that are currently redeemable.
          That means less time testing dead codes and more time finding genuine value across skincare, cosmetics, and self-care essentials.
        </p>
        <p>
          Before checkout, compare offer mechanics carefully. Some beauty retailers provide stronger value through threshold discounts or bundled sets rather than single-line coupons.
          When a verified promo code is available, copy it from the card and apply it at checkout. For routine purchases, monitor brand store pages to catch repeat campaign patterns.
        </p>
        <p>
          Aussie Dealz updates this category daily and prioritises listings with better reliability signals. If you encounter a code mismatch,
          send us feedback so we can audit and clean the listing quickly.
        </p>
      </section>
    </main>
  );
}

