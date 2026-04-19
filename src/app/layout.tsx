import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Coupons Australia | Best Deals & Discounts',
  description: 'Find the latest verified coupons, promo codes and deals from top Australian stores. Save money with Commission Factory Australia.',
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Coupons Australia | Best Deals & Discounts',
    description: 'Find the latest verified coupons, promo codes and deals from top Australian stores.',
    type: 'website',
    locale: 'en_AU',
    countryName: 'Australia',
  },
};

function Navbar() {
  return (
    <nav style={navStyle}>
      <div style={navContainerStyle}>
        <Link href="/" style={logoLinkStyle}>
          <img src="/logo.png" alt="Coupons Australia" style={logoStyle} />
        </Link>
        <div style={navLinksStyle}>
          <Link href="/" style={navLinkStyle}>Home</Link>
          <Link href="/stores" style={navLinkStyle}>Stores</Link>
          <Link href="/fashion-coupons" style={navLinkStyle}>Fashion</Link>
          <Link href="/beauty-coupons" style={navLinkStyle}>Beauty</Link>
          <Link href="/electronics-coupons" style={navLinkStyle}>Electronics</Link>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer style={footerStyle}>
      <div style={footerContainerStyle}>
        <div style={footerLogoStyle}>
          <img src="/logo.png" alt="Coupons Australia" style={footerLogoImgStyle} />
          <p style={footerTextStyle}>Save money with verified coupons from top Australian stores.</p>
        </div>
        <div style={footerLinksStyle}>
          <div style={footerColStyle}>
            <h4 style={footerTitleStyle}>Categories</h4>
            <Link href="/fashion-coupons" style={footerLinkStyle}>Fashion</Link>
            <Link href="/beauty-coupons" style={footerLinkStyle}>Beauty</Link>
            <Link href="/electronics-coupons" style={footerLinkStyle}>Electronics</Link>
          </div>
          <div style={footerColStyle}>
            <h4 style={footerTitleStyle}>Quick Links</h4>
            <Link href="/stores" style={footerLinkStyle}>All Stores</Link>
            <Link href="/today-deals" style={footerLinkStyle}>Today&apos;s Deals</Link>
            <Link href="/best-working-coupons" style={footerLinkStyle}>Best Coupons</Link>
          </div>
        </div>
        <div style={footerBottomStyle}>
          <p>&copy; {new Date().getFullYear()} Coupons Australia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

const navStyle: React.CSSProperties = {
  background: '#fff',
  borderBottom: '1px solid #e5e5e5',
  padding: '12px 0',
  position: 'sticky',
  top: 0,
  zIndex: 100,
};

const navContainerStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const logoLinkStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
};

const logoStyle: React.CSSProperties = {
  width: '220px',
  height: '56px',
  objectFit: 'contain',
};

const navLinksStyle: React.CSSProperties = {
  display: 'flex',
  gap: '24px',
};

const navLinkStyle: React.CSSProperties = {
  color: '#333',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: 500,
};

const footerStyle: React.CSSProperties = {
  background: '#1a1a1a',
  color: '#fff',
  padding: '60px 0 20px',
  marginTop: '60px',
};

const footerContainerStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 20px',
};

const footerLogoStyle: React.CSSProperties = {
  marginBottom: '32px',
};

const footerLogoImgStyle: React.CSSProperties = {
  width: '200px',
  height: '52px',
  objectFit: 'contain',
  marginBottom: '12px',
};

const footerTextStyle: React.CSSProperties = {
  color: '#999',
  fontSize: '14px',
};

const footerLinksStyle: React.CSSProperties = {
  display: 'flex',
  gap: '60px',
  marginBottom: '40px',
};

const footerColStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const footerTitleStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 600,
  marginBottom: '8px',
};

const footerLinkStyle: React.CSSProperties = {
  color: '#999',
  textDecoration: 'none',
  fontSize: '14px',
};

const footerBottomStyle: React.CSSProperties = {
  borderTop: '1px solid #333',
  paddingTop: '20px',
  textAlign: 'center',
  color: '#666',
  fontSize: '14px',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
