import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Aussie Dealz',
  description: 'Contact Aussie Dealz for coupon issues, partnerships, or editorial feedback.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <main style={{ maxWidth: 920, margin: '40px auto', padding: '0 20px', lineHeight: 1.7 }}>
      <h1>Contact Us</h1>
      <p>
        Need help with a coupon, spotted an expired code, or want to discuss a partnership? We would love to hear from you.
      </p>
      <p>
        Email: <a href="mailto:hello@aussiedealz.com">hello@aussiedealz.com</a>
      </p>
      <h2>Support Form</h2>
      <form action="mailto:hello@aussiedealz.com" method="post" encType="text/plain" style={{ display: 'grid', gap: 12, maxWidth: 620 }}>
        <input name="name" placeholder="Your name" required style={{ padding: 12 }} />
        <input name="email" type="email" placeholder="Your email" required style={{ padding: 12 }} />
        <input name="store" placeholder="Store name (optional)" style={{ padding: 12 }} />
        <textarea name="message" placeholder="How can we help?" rows={6} required style={{ padding: 12 }} />
        <button type="submit" style={{ padding: '12px 18px', width: 180 }}>Send Message</button>
      </form>
    </main>
  );
}
