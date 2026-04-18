import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import Link from 'next/link';
import styles from '@/app/page.module.css';

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const queryText = q || '';
  
  return {
    title: queryText ? `Search: ${queryText} | Australian Coupons` : 'Search Coupons',
    description: `Search for ${queryText} coupons and deals in Australia.`,
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  
  if (!q) {
    redirect('/');
  }
  
  const searchTerm = `%${q}%`;
  
  const stores = await query<{
    id: number;
    name: string;
    slug: string;
    logo_url: string | null;
  }>(
    `SELECT * FROM advertisers WHERE name LIKE ? AND logo_url IS NOT NULL LIMIT 20`,
    [searchTerm]
  );
  
  const offers = await query<{
    id: number;
    title: string;
    coupon_code: string | null;
    advertiser_name: string;
    advertiser_slug: string;
    logo_url: string | null;
  }>(
    `SELECT o.id, o.title, o.coupon_code, a.name as advertiser_name, a.slug as advertiser_slug, a.logo_url
     FROM offers o
     JOIN advertisers a ON o.advertiser_id = a.id
     WHERE o.is_expired = 0 AND (o.title LIKE ? OR a.name LIKE ?)
     LIMIT 40`,
    [searchTerm, searchTerm]
  );

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1>Search Results</h1>
        <p>Showing results for "{q}"</p>
      </section>
      
      {stores.length > 0 && (
        <section className={styles.section}>
          <h2>🏪 Stores</h2>
          <div className={styles.storesGrid}>
            {stores.map((store) => (
              <Link
                key={store.id}
                href={`/store/${store.slug}`}
                className={styles.storeCard}
              >
                {store.logo_url && (
                  <img src={store.logo_url} alt={store.name} />
                )}
                <span>{store.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
      
      {offers.length > 0 ? (
        <section className={styles.section}>
          <h2>🎟️ Coupons ({offers.length})</h2>
          <div className={styles.grid}>
            {offers.map((offer) => (
              <Link
                key={offer.id}
                href={`/store/${offer.advertiser_slug}`}
                className={styles.card}
              >
                <h3>{offer.title}</h3>
                <p className={styles.storeName}>{offer.advertiser_name}</p>
                {offer.coupon_code && (
                  <span className={styles.couponCode}>{offer.coupon_code}</span>
                )}
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <div className={styles.emptyState}>
          <p>No results found for "{q}". Try different keywords.</p>
          <Link href="/" className={styles.viewDeal}>Browse All Coupons</Link>
        </div>
      )}
    </main>
  );
}