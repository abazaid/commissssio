import type { MetadataRoute } from 'next';
import { query } from '@/lib/db';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aussiedealz.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    '/',
    '/stores',
    '/today-deals',
    '/best-working-coupons',
    '/fashion-coupons',
    '/beauty-coupons',
    '/electronics-coupons',
    '/home-coupons',
    '/sports-coupons',
    '/food-coupons',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms',
    '/blog',
    '/methodology',
    '/authors/sarah-mitchell',
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: path === '/' ? 1 : 0.7,
  }));

  try {
    const stores = await query<{ slug: string; updated_at?: Date }>(
      "SELECT slug, updated_at FROM advertisers WHERE status = 'active' ORDER BY id DESC LIMIT 5000"
    );

    const storeRoutes: MetadataRoute.Sitemap = stores.map((store) => ({
      url: `${siteUrl}/store/${store.slug}`,
      lastModified: store.updated_at || now,
      changeFrequency: 'daily',
      priority: 0.8,
    }));

    return [...staticRoutes, ...storeRoutes];
  } catch {
    return staticRoutes;
  }
}

