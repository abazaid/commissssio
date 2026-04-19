import { Metadata } from 'next';
import Link from 'next/link';
import { getCategoryData } from '@/lib/category';
import styles from '@/app/page.module.css';

export const revalidate = 1800;

export const metadata: Metadata = {
  title: 'Food and Grocery Coupons Australia',
  description: 'Track active food and grocery promotions from Australian retailers and delivery services.',
  alternates: { canonical: '/food-coupons' },
};

export default async function FoodCouponsPage() {
  const { offers, stores } = await getCategoryData('food');

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1>Food &amp; Grocery Coupons Australia</h1>
        <p>Verified offers for groceries, pantry essentials, and food delivery.</p>
      </section>

      <section className={styles.section}>
        <h2>Top Food Deals</h2>
        <div className={styles.grid}>
          {offers.length > 0 ? offers.slice(0, 18).map((offer) => (
            <Link key={offer.id} href={`/api/click?offer_id=${offer.id}&sub_id=food_${offer.id}`} className={styles.card}>
              <div className={styles.cardBadge}>{offer.coupon_code ? 'GET CODE' : 'VIEW DEAL'}</div>
              <h3>{offer.title}</h3>
              <p className={styles.storeName}>{offer.advertiser_name}</p>
            </Link>
          )) : <p>No live food offers available right now.</p>}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Featured Stores</h2>
        <div className={styles.storesGrid}>
          {stores.length > 0 ? stores.map((store) => (
            <Link key={store.id} href={`/store/${store.slug}`} className={styles.storeCard}>
              {store.logo_url && <img src={store.logo_url} alt={store.name} />}
              <span>{store.name}</span>
            </Link>
          )) : <p>Store list is updating. Check back shortly.</p>}
        </div>
      </section>
    </main>
  );
}

