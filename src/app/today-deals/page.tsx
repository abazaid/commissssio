import { Metadata } from 'next';
import { getTopDeals } from '@/lib/ranking';
import Link from 'next/link';
import styles from '@/app/page.module.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Today's Best Deals Australia | Top Discounts",
    description: "Today&apos;s hottest deals from Australian stores. Save big with exclusive discounts and limited time offers.",
  };
}

export default async function TodayDealsPage() {
  const deals = await getTopDeals(50);

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1>Today&apos;s Best Deals Australia</h1>
        <p>Hottest deals and biggest discounts available now</p>
      </section>

      <section className={styles.section}>
        <div className={styles.grid}>
          {deals.map((deal) => (
            <Link
              key={deal.id}
              href={`/api/click?offer_id=${deal.id}&sub_id=todaydeals_${deal.id}`}
              className={styles.card}
            >
              {deal.logo_url && (
                <img src={deal.logo_url} alt={deal.advertiser_name} />
              )}
              <h3>{deal.title}</h3>
              <p>{deal.advertiser_name}</p>
              {deal.coupon_code && (
                <span className={styles.couponCode}>{deal.coupon_code}</span>
              )}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}