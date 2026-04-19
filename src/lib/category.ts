import { query } from './db';
import { getRankedOffers } from './ranking';

export type CategoryStore = {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
};

type CategoryOffer = {
  id: number;
  title: string;
  description: string | null;
  coupon_code: string | null;
  destination_url: string;
  tracking_url: string;
  start_date: Date | null;
  end_date: Date | null;
  is_verified: number;
  is_expired: number;
  advertiser_id: number;
  advertiser_name: string;
  advertiser_slug: string;
  logo_url: string | null;
  commission_rate: number;
  avg_order_value: number;
  conversion_rate: number;
  epc: number;
  clicks_count: number;
};

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  fashion: ['fashion', 'clothing', 'apparel', 'shoes', 'accessories'],
  beauty: ['beauty', 'skincare', 'cosmetics', 'makeup', 'fragrance'],
  electronics: ['electronics', 'tech', 'technology', 'gadgets', 'devices'],
  home: ['home', 'garden', 'furniture', 'decor', 'appliances'],
  sports: ['sports', 'fitness', 'outdoor', 'gym', 'active'],
  food: ['food', 'grocery', 'dining', 'restaurant', 'meal'],
};

export async function getCategoryData(category: string) {
  const normalized = category.toLowerCase();
  const keywords = CATEGORY_KEYWORDS[normalized] || [normalized];
  let offers = await getRankedOffers(36, normalized);
  let stores: CategoryStore[] = [];

  if (offers.length === 0) {
    const likeParts = keywords.map(() => 'LOWER(COALESCE(o.category, \'\')) LIKE ?').join(' OR ');
    const titleParts = keywords.map(() => 'LOWER(o.title) LIKE ?').join(' OR ');
    const params = [
      ...keywords.map((k) => `%${k}%`),
      ...keywords.map((k) => `%${k}%`),
    ];

    offers = await query<CategoryOffer>(
      `SELECT
         o.id, o.title, o.description, o.coupon_code, o.destination_url, o.tracking_url,
         o.start_date, o.end_date, o.is_verified, o.is_expired, o.advertiser_id,
         a.name as advertiser_name, a.slug as advertiser_slug, a.logo_url,
         COALESCE(a.commission_rate, 0) as commission_rate,
         COALESCE(a.avg_order_value, 0) as avg_order_value,
         COALESCE(a.conversion_rate, 0) as conversion_rate,
         COALESCE(a.epc, 0) as epc,
         0 as clicks_count
       FROM offers o
       JOIN advertisers a ON a.id = o.advertiser_id
       WHERE o.is_expired = 0
         AND a.status = 'active'
         AND ((${likeParts}) OR (${titleParts}))
       ORDER BY o.updated_at DESC
       LIMIT 36`,
      params
    );
  }

  if (offers.length === 0) {
    offers = await getRankedOffers(36);
  }

  try {
    if (offers.length > 0) {
      const ids = offers.map((o) => o.advertiser_id).filter(Boolean);
      if (ids.length > 0) {
        const placeholders = ids.map(() => '?').join(',');
        stores = await query<CategoryStore>(
          `SELECT id, name, slug, logo_url
           FROM advertisers
           WHERE status = 'active' AND id IN (${placeholders})
           ORDER BY name
           LIMIT 24`,
          ids
        );
      }
    }
  } catch {
    stores = [];
  }

  return { offers, stores };
}
