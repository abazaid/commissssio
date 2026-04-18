import Link from 'next/link';
import styles from '@/app/page.module.css';

export const dynamic = 'force-dynamic';

export default function BeautyCouponsPage() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <span style={{ fontSize: '48px' }}>💄</span>
        <h1>Beauty Coupons Australia</h1>
        <p>Makeup, skincare, cosmetics - Verified deals and promo codes</p>
      </section>
      <div className={styles.categoriesGrid}>
        <Link href="/stores" className={styles.categoryCard}>
          <span className={styles.categoryIcon}>🛍️</span>
          <span className={styles.categoryName}>All Stores</span>
        </Link>
      </div>
    </main>
  );
}