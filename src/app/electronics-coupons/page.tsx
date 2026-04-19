import { Metadata } from 'next';
import Link from 'next/link';
import { getCategoryData } from '@/lib/category';
import styles from '@/app/page.module.css';

export const revalidate = 1800;

export const metadata: Metadata = {
  title: 'Electronics Coupons Australia - Verified Promo Codes',
  description: 'Track verified electronics promo codes and tech deals from Australian retailers.',
  alternates: { canonical: '/electronics-coupons' },
  openGraph: {
    title: 'Electronics Coupons Australia',
    description: 'Verified gadgets, devices, and tech accessory deals in Australia.',
    url: '/electronics-coupons',
  },
};

export default async function ElectronicsCouponsPage() {
  const { offers, stores } = await getCategoryData('electronics');
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
        <h1>Electronics Coupons Australia</h1>
        <p>Verified tech discounts for devices, accessories, home electronics, and gaming.</p>
      </section>

      <section className={styles.section}>
        <h2>Top Electronics Deals</h2>
        <div className={styles.grid}>
          {offers.length > 0 ? offers.slice(0, 18).map((offer) => (
            <Link key={offer.id} href={`/api/click?offer_id=${offer.id}&sub_id=electronics_${offer.id}`} className={styles.card}>
              <div className={styles.cardBadge}>{offer.coupon_code ? 'GET CODE' : 'VIEW DEAL'}</div>
              <h3>{offer.title}</h3>
              <p className={styles.storeName}>{offer.advertiser_name}</p>
              {offer.coupon_code && <span className={styles.couponCode}>{offer.coupon_code}</span>}
            </Link>
          )) : <p>No live electronics offers available right now.</p>}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Featured Electronics Stores</h2>
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
        <h2>Top Verified Electronics Stores Comparison</h2>
        <p>Compare active tech code availability and listing freshness across stores.</p>
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
        <h2>Finding Better Tech Deals in Australia</h2>
        <p>
          Electronics discounts can vary significantly depending on launch cycles, stock turnover, and campaign timing.
          Aussie Dealz tracks currently active offers and highlights practical opportunities that can reduce checkout totals for Australian shoppers.
          We focus on promotions with clear redemption terms and remove stale listings when expiration windows pass.
        </p>
        <p>
          Tech buyers should compare coupon discounts against direct markdowns because many stores rotate between code-based and auto-applied offers.
          Check whether shipping thresholds or bundle offers produce better net value, particularly for accessories and peripherals where cross-sell pricing is common.
        </p>
        <p>
          This page is updated regularly with verified listings from active stores. If you notice a broken code,
          contact our team and we will review it as part of our ongoing quality workflow.
        </p>
      </section>
    </main>
  );
}

