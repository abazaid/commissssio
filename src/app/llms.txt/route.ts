import { NextResponse } from 'next/server';

const body = `# Aussie Dealz
> Australian coupon and deals aggregator. Verified promo codes and discount deals from major Australian retailers.
> Categories: Fashion, Beauty, Electronics, Home, Sports, Food & Grocery

## Key Pages
- https://aussiedealz.com/stores - Full store directory
- https://aussiedealz.com/today-deals - Today's best deals
- https://aussiedealz.com/best-working-coupons - Best verified codes
- https://aussiedealz.com/blog - Editorial savings guides
- https://aussiedealz.com/methodology - Verification standards
- https://aussiedealz.com/authors/sarah-mitchell - Deals editor profile

## Store Pages
- Pattern: https://aussiedealz.com/store/[store-name]
- Includes verified coupon codes, active deals, and FAQ content
`;

export function GET() {
  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

