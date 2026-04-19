import { Metadata } from 'next';
import { getTopDeals } from '@/lib/ranking';
import Link from 'next/link';
import styles from '@/app/page.module.css';

export const revalidate = 1800;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Today\'s Best Deals Australia',
    description: 'Today\'s hottest verified deals from Australian stores. Updated frequently by Aussie Dealz.',
    alternates: { canonical: '/today-deals' },
    openGraph: {
      title: 'Today\'s Best Deals Australia',
      description: 'Today\'s hottest verified deals from Australian stores.',
      url: '/today-deals',
    },
  };
}

export default async function TodayDealsPage() {
  const deals = await getTopDeals(50);

  const listSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Today\'s deals',
    itemListElement: deals.slice(0, 20).map((deal, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://aussiedealz.com/store/${deal.advertiser_slug}`,
      name: deal.title,
    })),
  };

  return (
    <main className={styles.main}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }} />
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

