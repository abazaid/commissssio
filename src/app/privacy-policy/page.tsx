import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read the Aussie Dealz privacy policy and how we handle data under Australian privacy expectations.',
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <main style={{ maxWidth: 980, margin: '40px auto', padding: '0 20px', lineHeight: 1.7 }}>
      <h1>Privacy Policy</h1>
      <p>Last updated: April 19, 2026</p>
      <p>
        Aussie Dealz respects your privacy. This policy explains what information we collect, how we use it, and your options.
      </p>
      <h2>Information We Collect</h2>
      <ul>
        <li>Technical information such as IP address, browser type, and device details.</li>
        <li>Click activity on offers to measure coupon performance and relevance.</li>
        <li>Information you voluntarily submit via contact forms or email.</li>
      </ul>
      <h2>How We Use Information</h2>
      <ul>
        <li>To maintain and improve coupon quality and ranking accuracy.</li>
        <li>To identify expired or broken deals.</li>
        <li>To respond to support requests and feedback.</li>
        <li>To comply with legal obligations.</li>
      </ul>
      <h2>Cookies and Analytics</h2>
      <p>
        We may use cookies and measurement tools to understand traffic and improve content quality. You can control cookies through your browser settings.
      </p>
      <h2>Affiliate Disclosure</h2>
      <p>
        Aussie Dealz may receive a commission when you purchase through links on our website. This does not affect editorial independence.
      </p>
      <p>
        We participate in affiliate programs including Commission Factory (publisher ID: 49343). Some outbound links may route through affiliate
        tracking domains such as <code>t.cfjump.com</code> to attribute commissions.
      </p>
      <h2>Your Rights</h2>
      <p>
        You may contact us to request access, correction, or deletion of personal information we hold where legally applicable.
      </p>
      <h2>Contact</h2>
      <p>Email: hello@aussiedealz.com</p>
    </main>
  );
}
