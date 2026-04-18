import { Metadata } from 'next';
import { getVerifiedCoupons } from '@/lib/ranking';
import Link from 'next/link';
import styles from '@/app/page.module.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Best Working Coupons Australia | Verified Promo Codes',
    description: 'Find verified, working promo codes from top Australian stores. All coupons tested and working.',
  };
}

export default async function BestCouponsPage() {
  const coupons = await getVerifiedCoupons(50);

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1>Best Working Coupons Australia</h1>
        <p>Verified promo codes that actually work</p>
      </section>

      <section className={styles.section}>
        <div className={styles.grid}>
          {coupons.map((coupon) => (
            <Link
              key={coupon.id}
              href={`/api/click?offer_id=${coupon.id}&sub_id=bestcoupon_${coupon.id}`}
              className={styles.card}
            >
              <h3>{coupon.title}</h3>
              <p>{coupon.advertiser_name}</p>
              <span className={styles.couponCode}>{coupon.coupon_code}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}