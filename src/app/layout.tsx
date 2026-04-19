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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aussiedealz.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Aussie Dealz | Verified Coupons & Promo Codes Australia',
    template: '%s | Aussie Dealz',
  },
  description:
    'Aussie Dealz helps Australians save with verified promo codes, coupons, and daily deals from top local retailers.',
  keywords: [
    'Aussie Dealz',
    'Australia coupons',
    'promo code australia',
    'discount codes',
    'verified deals',
  ],
  alternates: {
    canonical: '/',
    languages: {
      'en-AU': '/',
      'x-default': '/',
    },
  },
  authors: [{ name: 'Sarah Mitchell', url: `${siteUrl}/about` }],
  creator: 'Aussie Dealz Editorial Team',
  publisher: 'Aussie Dealz',
  icons: {
    icon: [{ url: '/logo.png', type: 'image/png' }],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Aussie Dealz | Verified Coupons & Promo Codes Australia',
    description:
      'Find working Australian discount codes and daily verified deals from hundreds of local stores.',
    url: siteUrl,
    siteName: 'Aussie Dealz',
    locale: 'en_AU',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Aussie Dealz',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aussie Dealz | Verified Coupons & Promo Codes Australia',
    description: 'Save money with verified Australian coupons and promo codes.',
    images: ['/logo.png'],
  },
};

function Navbar() {
  return (
    <nav style={navStyle}>
      <div style={navContainerStyle}>
        <Link href="/" style={logoLinkStyle}>
          <img src="/logo.png" alt="Aussie Dealz" style={logoStyle} />
        </Link>
        <div style={navLinksStyle}>
          <Link href="/" style={navLinkStyle}>Home</Link>
          <Link href="/stores" style={navLinkStyle}>Stores</Link>
          <Link href="/fashion-coupons" style={navLinkStyle}>Fashion</Link>
          <Link href="/beauty-coupons" style={navLinkStyle}>Beauty</Link>
          <Link href="/electronics-coupons" style={navLinkStyle}>Electronics</Link>
          <Link href="/blog" style={navLinkStyle}>Blog</Link>
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
          <img src="/logo.png" alt="Aussie Dealz" style={footerLogoImgStyle} />
          <p style={footerTextStyle}>
            Aussie Dealz earns a commission when you purchase through our links. This does not affect our editorial independence.
          </p>
        </div>
        <div style={footerLinksStyle}>
          <div style={footerColStyle}>
            <h4 style={footerTitleStyle}>Categories</h4>
            <Link href="/fashion-coupons" style={footerLinkStyle}>Fashion</Link>
            <Link href="/beauty-coupons" style={footerLinkStyle}>Beauty</Link>
            <Link href="/electronics-coupons" style={footerLinkStyle}>Electronics</Link>
            <Link href="/home-coupons" style={footerLinkStyle}>Home & Garden</Link>
          </div>
          <div style={footerColStyle}>
            <h4 style={footerTitleStyle}>Company</h4>
            <Link href="/about" style={footerLinkStyle}>About</Link>
            <Link href="/methodology" style={footerLinkStyle}>Methodology</Link>
            <Link href="/authors/sarah-mitchell" style={footerLinkStyle}>Author Profile</Link>
            <Link href="/contact" style={footerLinkStyle}>Contact</Link>
            <Link href="/privacy-policy" style={footerLinkStyle}>Privacy Policy</Link>
            <Link href="/terms" style={footerLinkStyle}>Terms</Link>
            <Link href="/blog" style={footerLinkStyle}>Blog</Link>
          </div>
        </div>
        <div style={footerBottomStyle}>
          <p>&copy; {new Date().getFullYear()} Aussie Dealz. All rights reserved.</p>
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
  gap: '18px',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
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
  color: '#c2c2c2',
  fontSize: '14px',
  lineHeight: 1.6,
  maxWidth: '760px',
};

const footerLinksStyle: React.CSSProperties = {
  display: 'flex',
  gap: '60px',
  marginBottom: '40px',
  flexWrap: 'wrap',
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
  color: '#b5b5b5',
  textDecoration: 'none',
  fontSize: '14px',
};

const footerBottomStyle: React.CSSProperties = {
  borderTop: '1px solid #333',
  paddingTop: '20px',
  textAlign: 'center',
  color: '#888',
  fontSize: '14px',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
