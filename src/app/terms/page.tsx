import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Terms and conditions for using Aussie Dealz and affiliate disclosure information.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <main style={{ maxWidth: 980, margin: '40px auto', padding: '0 20px', lineHeight: 1.7 }}>
      <h1>Terms and Conditions</h1>
      <p>Last updated: April 19, 2026</p>
      <p>
        By using Aussie Dealz, you agree to these terms. If you do not agree, please do not use the site.
      </p>
      <h2>Service Scope</h2>
      <p>
        Aussie Dealz publishes promotional offers, discount codes, and affiliate links from third-party retailers. Availability and final pricing are controlled by merchants.
      </p>
      <h2>No Guarantee</h2>
      <p>
        We work to keep listings current, but we cannot guarantee every code will work at all times. Promotions may change or expire without notice.
      </p>
      <h2>Affiliate Relationship</h2>
      <p>
        Aussie Dealz may earn a commission from qualifying purchases made through outbound links. This helps fund editorial operations and platform maintenance.
      </p>
      <h2>Limitation of Liability</h2>
      <p>
        Aussie Dealz is not liable for losses or disputes arising from third-party merchant transactions, product issues, or pricing differences.
      </p>
      <h2>Contact</h2>
      <p>Email: hello@aussiedealz.com</p>
    </main>
  );
}
