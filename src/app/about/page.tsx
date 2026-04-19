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
        sameAs: [
          process.env.NEXT_PUBLIC_BRAND_LINKEDIN || 'https://www.linkedin.com/company/aussiedealz',
          process.env.NEXT_PUBLIC_BRAND_X || 'https://x.com/aussiedealz',
          process.env.NEXT_PUBLIC_BRAND_GITHUB || 'https://github.com/abazaid/commissssio',
        ],
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
    <main style={{ maxWidth: 980, margin: '40px auto', padding: '0 20px', lineHeight: 1.8 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }} />
      <h1>About Aussie Dealz</h1>
      <p>
        Aussie Dealz is an Australian-focused coupons and deals platform built to help shoppers save money without wasting time on expired or low-quality offers.
        We started with a simple problem: discount discovery in Australia is noisy. Users often find codes that are outdated, poorly matched to the merchant,
        or presented without enough context to know whether they are worth trying.
      </p>
      <p>
        Our goal is to improve that experience through structured data ingestion, clear editorial standards, and practical savings guidance.
        Instead of publishing every offer equally, we combine feed-based sourcing with quality filters and prioritisation signals designed around real checkout outcomes.
      </p>

      <h2>Our Story</h2>
      <p>
        Aussie Dealz was built as a local-first project focused on Australian shoppers and retailers. Over time, the platform expanded to cover hundreds of stores
        across fashion, beauty, electronics, home, sports, and food categories. As inventory grew, we introduced repeatable verification steps to reduce stale listings
        and improve the relevance of what appears on category and store pages.
      </p>
      <p>
        We believe the value of a deals platform is not in raw listing volume alone. It comes from helping people find genuinely usable offers quickly.
        That is why we invest in editorial review and regular cleanup rather than relying only on automated imports.
      </p>

      <h2>Editorial Team</h2>
      <p>
        Our deals desk is led by <strong>Sarah Mitchell, Deals Editor</strong>, with over five years of experience covering Australian retail savings.
        Sarah is responsible for quality controls, verification standards, and weekly editorial coverage. You can view her profile at
        <a href="/authors/sarah-mitchell"> /authors/sarah-mitchell</a>.
      </p>

      <h2>How We Verify Coupons</h2>
      <p>
        We source offers from partner feeds and evaluate each listing against minimum quality requirements. Campaigns missing critical fields such as valid destination links,
        store mapping, or clear date boundaries are excluded. Expired offers are automatically flagged, and repeated user-reported failures are reviewed by the editorial team.
      </p>
      <p>
        Our ranking model considers freshness, merchant quality indicators, and engagement signals to surface more useful offers near the top of listings.
        Full methodology is published at <a href="/methodology">/methodology</a>.
      </p>

      <h2>What We Cover</h2>
      <ul>
        <li>Verified coupon codes and non-code promotions from Australian retailers.</li>
        <li>Category-level deal discovery across major shopping verticals.</li>
        <li>Editorial explainers and weekly savings roundups.</li>
        <li>Reference resources such as sale calendar guidance.</li>
      </ul>

      <h2>Business Model and Independence</h2>
      <p>
        Aussie Dealz is free to use. We may earn a commission when users purchase through affiliate links.
        This commercial relationship supports platform operations but does not override editorial quality standards.
        We disclose affiliate relationships sitewide and within editorial content where relevant.
      </p>

      <h2>Contact and Transparency</h2>
      <p>
        We welcome feedback on expired codes, broken links, and listing quality.
        Contact us at <a href="mailto:hello@aussiedealz.com">hello@aussiedealz.com</a>.
      </p>
      <p>
        Editorial office: Sydney, NSW, Australia.
      </p>
    </main>
  );
}
