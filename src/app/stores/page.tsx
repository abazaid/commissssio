import { Metadata } from 'next';
import { query } from '@/lib/db';
import Link from 'next/link';
import styles from '@/app/page.module.css';

export const revalidate = 1800;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'All Stores Directory Australia',
    description: 'Browse active Australian stores with verified coupons, promo codes, and daily offers on Aussie Dealz.',
    alternates: { canonical: '/stores' },
    openGraph: {
      title: 'All Stores Directory Australia',
      description: 'Browse active Australian stores with verified coupons and offers.',
      url: '/stores',
    },
  };
}

export default async function StoresPage() {
  const stores = await query<{
    id: number;
    name: string;
    slug: string;
    logo_url: string | null;
  }>(
    `SELECT id, name, slug, logo_url
     FROM advertisers
     WHERE status = 'active' AND logo_url IS NOT NULL
     ORDER BY name`
  );

  const listSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Australian store directory',
    itemListElement: stores.slice(0, 200).map((store, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://aussiedealz.com/store/${store.slug}`,
      name: store.name,
    })),
  };

  return (
    <main className={styles.main}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }} />
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
          </Link>
        ))}
      </div>
    </main>
  );
}

