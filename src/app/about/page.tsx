import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Aussie Dealz',
  description:
    'Learn who runs Aussie Dealz, how we verify coupons, and how our editorial team keeps Australian deal pages accurate.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'Aussie Dealz',
        url: 'https://aussiedealz.com',
      },
      {
        '@type': 'Person',
        name: 'Sarah Mitchell',
        jobTitle: 'Deals Editor',
        worksFor: { '@type': 'Organization', name: 'Aussie Dealz' },
      },
    ],
  };

  return (
    <main style={{ maxWidth: 980, margin: '40px auto', padding: '0 20px', lineHeight: 1.7 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }} />
      <h1>About Aussie Dealz</h1>
      <p>
        Aussie Dealz is an Australian-focused coupons and deals platform built to help shoppers save money without wasting time on expired codes.
        We index promotions from affiliate network feeds and combine them with editorial quality checks so visitors can quickly find the best available offers.
      </p>
      <p>
        Our deals desk is led by <strong>Sarah Mitchell, Deals Editor</strong>, with over five years of experience covering Australian retail savings.
        Sarah and the editorial team review new offers, remove expired listings, and prioritise codes with better shopper outcomes.
      </p>
      <p>
        We verify deals by checking availability windows, matching code-to-store relevance, and ranking offers using quality signals such as freshness,
        advertiser reliability, and historical click behaviour. Promotions marked as verified have passed additional editorial checks.
      </p>
      <p>
        Aussie Dealz is free for users. We may earn a commission when you click through and make a purchase with one of our partner retailers.
        This commercial relationship does not influence the integrity of our editorial ranking methodology.
      </p>
      <h2>Editorial Method</h2>
      <ul>
        <li>Automated feed sync from trusted affiliate partners.</li>
        <li>Expiry and duplication checks on import.</li>
        <li>Manual spot checks on top traffic stores and high-intent categories.</li>
        <li>Regular cleanup to remove non-performing or stale promotions.</li>
      </ul>
      <p>
        If you find an offer that no longer works, contact us and we will review it.
      </p>
    </main>
  );
}
