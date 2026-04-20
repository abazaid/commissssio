import { Metadata } from 'next';
import { getVerifiedCoupons } from '@/lib/ranking';
import Link from 'next/link';
import styles from '@/app/page.module.css';

export const revalidate = 1800;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Best Working Coupons Australia',
    description: 'Find verified and currently working promo codes from Australian stores.',
    alternates: { canonical: '/best-working-coupons' },
    openGraph: {
      title: 'Best Working Coupons Australia',
      description: 'Verified promo codes from Australian stores.',
      url: '/best-working-coupons',
    },
  };
}

export default async function BestCouponsPage() {
  const coupons = await getVerifiedCoupons(50);
  const generatedAt = new Date().toISOString().split('T')[0];
  const formatDate = (value?: Date | string | null) =>
    value ? new Date(value).toISOString().split('T')[0] : null;
  const resolveUpdatedDate = (coupon: { updated_at?: Date | string | null; created_at?: Date | string | null }) =>
    formatDate(coupon.updated_at || coupon.created_at) || generatedAt;
  const pageLastUpdated = coupons.map(resolveUpdatedDate).sort().reverse()[0] || generatedAt;

  const listSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best working coupons',
    itemListElement: coupons.slice(0, 20).map((coupon, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://aussiedealz.com/store/${coupon.advertiser_slug}`,
      name: coupon.title,
    })),
  };

  return (
    <main className={styles.main}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }} />
      <section className={styles.hero}>
        <h1>Best Working Coupons Australia</h1>
        <p>Verified promo codes that actually work</p>
      </section>

      <section className={styles.section}>
        <p>Last updated: {pageLastUpdated}</p>
        <div className={styles.grid}>
          {coupons.map((coupon) => (
            <Link
              key={coupon.id}
              href={`/api/click?offer_id=${coupon.id}&sub_id=bestcoupon_${coupon.id}`}
              className={styles.card}
            >
              <h3>{coupon.title}</h3>
              <p>{coupon.advertiser_name}</p>
              <p>Updated: {resolveUpdatedDate(coupon)}</p>
              <span className={styles.couponCode}>{coupon.coupon_code}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

