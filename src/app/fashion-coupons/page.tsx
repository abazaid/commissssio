import Link from 'next/link';
import styles from '@/app/page.module.css';

export const dynamic = 'force-dynamic';

export default function FashionCouponsPage() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <span style={{ fontSize: '48px' }}>👗</span>
        <h1>Fashion Coupons Australia</h1>
        <p>Clothing, shoes, accessories - Verified deals and promo codes</p>
      </section>
      <div className={styles.categoriesGrid}>
        <Link href="/stores" className={styles.categoryCard}>
          <span className={styles.categoryIcon}>🛍️</span>
          <span className={styles.categoryName}>All Stores</span>
        </Link>
        <Link href="/store/vetsupply" className={styles.categoryCard}>
          <span className={styles.categoryIcon}>🐕</span>
          <span className={styles.categoryName}>Pet Supplies</span>
        </Link>
        <Link href="/store/pharmacy-online" className={styles.categoryCard}>
          <span className={styles.categoryIcon}>💊</span>
          <span className={styles.categoryName}>Pharmacy</span>
        </Link>
      </div>
    </main>
  );
}