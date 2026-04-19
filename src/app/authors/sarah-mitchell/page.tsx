import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sarah Mitchell - Deals Editor',
  description: 'Profile of Sarah Mitchell, Deals Editor at Aussie Dealz, with editorial scope and verification responsibilities.',
  alternates: { canonical: '/authors/sarah-mitchell' },
};

export default function SarahAuthorPage() {
  const linkedInUrl = process.env.NEXT_PUBLIC_EDITOR_LINKEDIN || 'https://www.linkedin.com/company/aussiedealz';
  const xUrl = process.env.NEXT_PUBLIC_EDITOR_X || 'https://x.com/aussiedealz';

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Sarah Mitchell',
    jobTitle: 'Deals Editor',
    worksFor: {
      '@type': 'Organization',
      name: 'Aussie Dealz',
      url: 'https://aussiedealz.com',
    },
    url: 'https://aussiedealz.com/authors/sarah-mitchell',
    sameAs: [linkedInUrl, xUrl],
  };

  return (
    <main style={{ maxWidth: 900, margin: '40px auto', padding: '0 20px', lineHeight: 1.8 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <h1>Sarah Mitchell</h1>
      <p><strong>Role:</strong> Deals Editor, Aussie Dealz</p>
      <p>
        Sarah Mitchell leads editorial quality for coupon and deal publishing at Aussie Dealz. Her work focuses on creating dependable savings guidance for
        Australian shoppers by combining feed-driven campaign discovery with practical verification standards that prioritize usability at checkout.
      </p>
      <p>
        Over more than five years in retail savings publishing, Sarah has developed operating workflows for campaign validation, listing cleanup, and ranking quality.
        She specializes in identifying patterns that separate genuinely useful promotions from low-confidence noise, including expiry behavior, conflicting terms,
        and destination mismatch issues that often cause failed redemption attempts.
      </p>
      <p>
        At Aussie Dealz, Sarah works across high-traffic store pages, category hubs, and weekly editorial pieces to ensure offers remain current and contextually
        useful. Her role includes reviewing user-reported code failures, prioritizing retests for sensitive campaigns, and adjusting editorial focus based on
        conversion-oriented quality signals. The objective is simple: reduce friction for shoppers and increase the probability that the first offer they try is the
        one that works.
      </p>
      <p>
        Sarah also contributes to methodology governance. She helps define the rules for source acceptance, stale-offer removal, and campaign confidence scoring.
        These rules are applied across the site to improve consistency between store pages, category pages, and blog references. When campaign quality changes quickly,
        she coordinates rapid content updates so users are less likely to encounter dead or misleading listings.
      </p>
      <p>
        Her editorial approach emphasizes transparent disclosures, clear dates, and structured buyer guidance. Rather than treating deal discovery as a list-only task,
        Sarah publishes content that teaches users how to evaluate offer mechanics, compare coupon and non-coupon paths, and plan purchases around Australian retail
        calendar windows. This practical emphasis helps turn raw promotions into actionable savings decisions.
      </p>
      <h2>Editorial Responsibilities</h2>
      <ul>
        <li>Reviewing active offers and removing stale promotions.</li>
        <li>Defining verification criteria for coupon reliability.</li>
        <li>Publishing weekly insights and educational savings content.</li>
        <li>Coordinating quality checks across high-traffic store pages.</li>
        <li>Auditing feedback signals to improve ranking and listing quality.</li>
      </ul>
      <h2>Credentials and Professional Profiles</h2>
      <p>
        Sarah&apos;s work is linked to public profile entities used for author and brand consistency:
      </p>
      <ul>
        <li>LinkedIn: <a href={linkedInUrl} rel="noopener noreferrer" target="_blank">{linkedInUrl}</a></li>
        <li>X (Twitter): <a href={xUrl} rel="noopener noreferrer" target="_blank">{xUrl}</a></li>
      </ul>
      <p>
        Methodology details: <a href="/methodology">https://aussiedealz.com/methodology</a>
      </p>
    </main>
  );
}
