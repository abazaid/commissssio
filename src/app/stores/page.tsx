import { Metadata } from 'next';
import { query } from '@/lib/db';
import Link from 'next/link';
import styles from '@/app/page.module.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'All Stores | Australian Coupons',
    description: 'Browse all stores offering coupons and deals in Australia.',
  };
}

export default async function StoresPage() {
  const stores = await query<{
    id: number;
    name: string;
    slug: string;
    logo_url: string | null;
    commission_rate: number | null;
  }>(
    `SELECT id, name, slug, logo_url, commission_rate 
     FROM advertisers 
     WHERE status = 'active' AND logo_url IS NOT NULL 
     ORDER BY name`
  );

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1>All Stores</h1>
        <p>Browse {stores.length} stores with coupons and deals</p>
      </section>

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
            {store.commission_rate && (
              <small>{store.commission_rate}% commission</small>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}