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

