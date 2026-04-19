import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sarah Mitchell - Deals Editor',
  description: 'Profile of Sarah Mitchell, Deals Editor at Aussie Dealz, with editorial scope and verification responsibilities.',
  alternates: { canonical: '/authors/sarah-mitchell' },
};

export default function SarahAuthorPage() {
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
  };

  return (
    <main style={{ maxWidth: 900, margin: '40px auto', padding: '0 20px', lineHeight: 1.8 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <h1>Sarah Mitchell</h1>
      <p><strong>Role:</strong> Deals Editor, Aussie Dealz</p>
      <p>
        Sarah Mitchell leads the editorial quality workflow for coupon and deal publishing at Aussie Dealz. She focuses on Australian retail savings coverage,
        offer freshness controls, and verification standards used across store and category pages.
      </p>
      <p>
        Sarah has more than five years of experience reviewing promotions, identifying campaign patterns, and improving deal discovery quality for high-intent shoppers.
        Her work includes maintaining verification guidelines, auditing stale listings, and refining ranking priorities for stronger user outcomes.
      </p>
      <h2>Editorial Responsibilities</h2>
      <ul>
        <li>Reviewing active offers and removing stale promotions.</li>
        <li>Defining verification criteria for coupon reliability.</li>
        <li>Publishing weekly insights and educational savings content.</li>
        <li>Coordinating quality checks across high-traffic store pages.</li>
      </ul>
      <p>
        Methodology details: <a href="/methodology">https://aussiedealz.com/methodology</a>
      </p>
    </main>
  );
}
