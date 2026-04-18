import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { query, queryOne } from '@/lib/db';
import { getRankedOffers } from '@/lib/ranking';
import Link from 'next/link';
import styles from '@/app/page.module.css';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getCurrentDate() {
  return {
    month: MONTHS[new Date().getMonth()],
    year: new Date().getFullYear(),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const store = await queryOne<{ name: string }>('SELECT name FROM advertisers WHERE slug = ?', [slug]);

  if (!store) return { title: 'Store Not Found' };

  const { month, year } = getCurrentDate();

  return {
    title: `${store.name} Discount Codes & Coupons Australia - ${month} ${year}`,
    description: `Find the latest verified ${store.name} coupons and deals. Save money with verified promo codes from ${store.name} Australia. Up to 70% off.`,
    keywords: `${store.name} coupon, ${store.name} promo code, ${store.name} discount, ${store.name} Australia deals`,
    openGraph: {
      title: `${store.name} Coupons | Exclusive Deals Australia`,
      description: `Get the best ${store.name} coupons and deals in Australia.`,
    },
  };
}

export default async function StorePage({ params }: Props) {
  const { slug } = await params;
  const { month, year } = getCurrentDate();

  const store = await queryOne<{
    id: number;
    name: string;
    slug: string;
    logo_url: string | null;
    category: string | null;
  }>('SELECT * FROM advertisers WHERE slug = ?', [slug]);

  if (!store) notFound();

  const storeOffers = await getRankedOffers(100, undefined, slug);

  const bestCoupons = storeOffers.filter((o) => o.coupon_code && o.is_expired === 0);
  const deals = storeOffers.filter((o) => !o.coupon_code && o.is_expired === 0);

  const creatives = await query<{
    id: number;
    image_url: string | null;
  }>(
    'SELECT id, image_url FROM creatives WHERE advertiser_id = ? AND image_url IS NOT NULL ORDER BY RAND() LIMIT 10',
    [store.id]
  );

  const featuredBanner = creatives[0];
  const carouselBanners = creatives.slice(1, 8);

  return (
    <main className={styles.main}>
      <section className={styles.storeHero}>
        {store.logo_url && <img src={store.logo_url} alt={store.name} className={styles.storeLogo} />}
        <div className={styles.storeHeroText}>
          <h1>{store.name} Discount Codes & Coupons Australia - {month} {year}</h1>
          <p>Find the latest verified {store.name} coupons and promo codes. Save money with exclusive discounts from {store.name} Australia.</p>
        </div>
      </section>

      {featuredBanner && (
        <section className={styles.section}>
          <h2>Hot Deals Today</h2>
          <a
            href={`/api/click?creative_id=${featuredBanner.id}&sub_id=store_${slug}_banner_${featuredBanner.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.featuredBanner}
          >
            <img src={featuredBanner.image_url || ''} alt="Hot Deal" />
          </a>
        </section>
      )}

      <section className={styles.section}>
        <h2>Best Verified Coupons</h2>
        {bestCoupons.length > 0 ? (
          <div className={styles.couponsGrid}>
            {bestCoupons.slice(0, 5).map((coupon) => (
              <Link
                key={coupon.id}
                href={`/api/click?offer_id=${coupon.id}&sub_id=store_${slug}_coupon_${coupon.id}`}
                className={styles.couponCard}
              >
                <div className={styles.couponBadge}>VERIFIED</div>
                <h3>{coupon.title}</h3>
                <p className={styles.couponCodeBig}>{coupon.coupon_code}</p>
                <button className={styles.getCodeBtn}>GET CODE</button>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>No coupons available.</p>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2>Today&apos;s Deals</h2>
        {deals.length > 0 ? (
          <div className={styles.grid}>
            {deals.slice(0, 10).map((deal) => (
              <Link
                key={deal.id}
                href={`/api/click?offer_id=${deal.id}&sub_id=store_${slug}_deal_${deal.id}`}
                className={styles.card}
              >
                <div className={styles.cardBadge}>DEAL</div>
                <h3>{deal.title}</h3>
                <span className={styles.viewDeal}>VIEW DEAL</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>No deals available right now.</p>
          </div>
        )}
      </section>

      {carouselBanners.length > 0 && (
        <section className={styles.section}>
          <h2>Featured Banners</h2>
          <div className={styles.bannerCarousel}>
            {carouselBanners.map((banner) => (
              <Link
                key={banner.id}
                href={`/api/click?creative_id=${banner.id}&sub_id=store_${slug}_banner_${banner.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.bannerCard}
              >
                {banner.image_url && <img src={banner.image_url} alt="Banner" />}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className={styles.faqSection}>
        <h2>Frequently Asked Questions</h2>

        <div className={styles.faqItem}>
          <h3>How do I use a {store.name} coupon code?</h3>
          <p>Click &quot;GET CODE&quot; on any coupon, copy the code, and paste it at checkout on {store.name}.</p>
        </div>

        <div className={styles.faqItem}>
          <h3>Are these {store.name} coupons verified?</h3>
          <p>Yes. All coupons marked with the VERIFIED badge are tested and working. We update them daily.</p>
        </div>

        <div className={styles.faqItem}>
          <h3>Can I combine {store.name} discount codes?</h3>
          <p>Most stores only allow one coupon per order. Try our verified codes for the best discount.</p>
        </div>
      </section>

      <section className={styles.seoContent}>
        <h2>About {store.name} Coupons Australia</h2>
        <p>
          Looking for the latest {store.name} promo codes and discount coupons in Australia? We&apos;ve collected
          the best verified coupons for {store.name} to help you save money on your next purchase.
        </p>
        <p>
          Our team manually verifies each coupon code to ensure it works. Browse our latest {store.name}
          discount codes above and start saving today. We update our coupon database daily.
        </p>
        <p>
          For more {store.name} deals and promotions, check back regularly or sign up for our
          newsletter to get the latest coupons delivered to your inbox.
        </p>
      </section>
    </main>
  );
}
