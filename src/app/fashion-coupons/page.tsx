import { Metadata } from 'next';
import Link from 'next/link';
import { getCategoryData } from '@/lib/category';
import styles from '@/app/page.module.css';

export const revalidate = 1800;

export const metadata: Metadata = {
  title: 'Fashion Coupons Australia - Verified Promo Codes',
  description: 'Browse verified fashion promo codes and clothing deals from Australian retailers. Updated daily by the Aussie Dealz editorial team.',
  alternates: { canonical: '/fashion-coupons' },
  openGraph: {
    title: 'Fashion Coupons Australia',
    description: 'Verified clothing and apparel promo codes from Australian stores.',
    url: '/fashion-coupons',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fashion Coupons Australia',
    description: 'Verified clothing and apparel promo codes from Australian stores.',
  },
};

export default async function FashionCouponsPage() {
  const { offers, stores } = await getCategoryData('fashion');

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Fashion Coupons Australia',
    itemListElement: offers.slice(0, 12).map((offer, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://aussiedealz.com/store/${offer.advertiser_slug}`,
      name: offer.title,
    })),
  };

  return (
    <main className={styles.main}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <section className={styles.hero}>
        <h1>Fashion Coupons Australia</h1>
        <p>Verified fashion deals, discount codes, and limited-time offers from Australian stores.</p>
      </section>

      <section className={styles.section}>
        <h2>Top Fashion Deals</h2>
        <div className={styles.grid}>
          {offers.length > 0 ? offers.slice(0, 18).map((offer) => (
            <Link key={offer.id} href={`/api/click?offer_id=${offer.id}&sub_id=fashion_${offer.id}`} className={styles.card}>
              <div className={styles.cardBadge}>{offer.coupon_code ? 'GET CODE' : 'VIEW DEAL'}</div>
              <h3>{offer.title}</h3>
              <p className={styles.storeName}>{offer.advertiser_name}</p>
              {offer.coupon_code && <span className={styles.couponCode}>{offer.coupon_code}</span>}
            </Link>
          )) : <p>No live fashion offers available right now.</p>}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Featured Fashion Stores</h2>
        <div className={styles.storesGrid}>
          {stores.length > 0 ? stores.map((store) => (
            <Link key={store.id} href={`/store/${store.slug}`} className={styles.storeCard}>
              {store.logo_url && <img src={store.logo_url} alt={store.name} />}
              <span>{store.name}</span>
            </Link>
          )) : <p>Store list is updating. Check back shortly.</p>}
        </div>
      </section>

      <section className={styles.seoContent}>
        <h2>How to Save More on Fashion in Australia</h2>
        <p>
          Fashion discounts in Australia move quickly, especially around seasonal wardrobe changes, new collection drops, and major shopping windows such as EOFY and Black Friday.
          Aussie Dealz helps you filter through noisy promo streams by highlighting codes and deals that are currently active and relevant to local shoppers.
          We prioritise offers with clear terms and current availability windows so you can focus on checkout-ready discounts instead of expired placeholders.
        </p>
        <p>
          For best results, compare both coupon and non-coupon offers before buying. Some retailers provide stronger value through automatic markdowns or bundle deals than code-based offers.
          When a code is available, copy it directly from the deal card and apply it at checkout. If you are shopping across categories, start from store pages to see the latest mixed promotion set.
        </p>
        <p>
          Our editorial team continuously reviews top-performing merchants and removes stale entries, so the fashion category stays useful as an ongoing savings resource for Australian shoppers.
          If you spot an expired code, contact us and we will re-check it quickly.
        </p>
      </section>
    </main>
  );
}

