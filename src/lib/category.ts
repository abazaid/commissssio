import { query } from './db';
import { getRankedOffers } from './ranking';

export type CategoryStore = {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
};

export async function getCategoryData(category: string) {
  const offers = await getRankedOffers(36, category);
  let stores: CategoryStore[] = [];

  try {
    stores = await query<CategoryStore>(
      `SELECT DISTINCT a.id, a.name, a.slug, a.logo_url
       FROM advertisers a
       JOIN offers o ON o.advertiser_id = a.id
       WHERE a.status = 'active' AND o.is_expired = 0 AND LOWER(o.category) = LOWER(?)
       ORDER BY a.name
       LIMIT 24`,
      [category]
    );
  } catch {
    stores = [];
  }

  return { offers, stores };
}
