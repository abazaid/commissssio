import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coupon Verification Methodology',
  description: 'How Aussie Dealz sources, validates, ranks, and updates coupons and deals for Australian shoppers.',
  alternates: { canonical: '/methodology' },
};

export default function MethodologyPage() {
  return (
    <main style={{ maxWidth: 980, margin: '40px auto', padding: '0 20px', lineHeight: 1.8 }}>
      <h1>Coupon Verification Methodology</h1>
      <p>
        This page documents how Aussie Dealz sources, verifies, ranks, and refreshes coupon and deal listings for Australian shoppers.
      </p>

      <h2>1. Source Collection</h2>
      <p>
        We ingest offers from affiliate partner feeds and store-level campaign streams. Primary sources include Commission Factory network data and
        approved merchant promotion endpoints. Listings without essential fields (destination URL, tracking URL, or merchant mapping) are excluded.
      </p>

      <h2>2. Validation Filters</h2>
      <ul>
        <li>Reject missing or malformed tracking links.</li>
        <li>Reject offers without clear merchant attribution.</li>
        <li>Mark expired campaigns using end-date checks.</li>
        <li>Flag duplicate external IDs for consolidation.</li>
      </ul>

      <h2>3. Editorial Checks</h2>
      <p>
        Our editorial team reviews high-traffic stores and high-intent categories to confirm campaign relevance and remove stale entries.
        Verification includes title clarity, campaign scope consistency, and category fit.
      </p>

      <h2>4. Ranking Logic</h2>
      <p>
        Offer ranking combines freshness, conversion-oriented quality signals, advertiser-level metrics, and historical click behavior.
        This helps prioritise listings that are more likely to convert for users.
      </p>

      <h2>5. Update Cadence</h2>
      <p>
        Feed sync runs on a scheduled cadence and can be triggered manually for urgent refreshes. Expired offers are automatically de-prioritised or removed
        from active listings.
      </p>

      <h2>6. Corrections Process</h2>
      <p>
        Users can report broken or misleading deals via our contact page. Reported listings are reviewed and corrected or removed in the next editorial pass.
      </p>

      <h2>7. Disclosure</h2>
      <p>
        Aussie Dealz may earn affiliate commissions from qualifying purchases. Commercial relationships do not override editorial quality controls.
      </p>
    </main>
  );
}
