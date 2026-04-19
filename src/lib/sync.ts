import { query, execute } from './db';
import { cacheDelete } from './redis';
import slugify from 'slug';

type Merchant = {
  Id: number;
  Name: string;
  AvatarUrl?: string;
  CommissionRate?: number;
};

type Coupon = {
  Id: number;
  MerchantId: number;
  Description?: string;
  Code?: string;
  TargetUrl: string;
  TrackingUrl: string;
  StartDate?: string;
  EndDate?: string;
  Category?: string;
};

type Banner = {
  Id: number;
  MerchantId: number;
  Size?: string;
  ImageUrl?: string;
  Width?: number;
  Height?: number;
  TrackingUrl: string;
};

type Promotion = {
  Id: number;
  MerchantId: number;
  Description?: string;
  TargetUrl: string;
  TrackingUrl: string;
  StartDate?: string;
  EndDate?: string;
  Category?: string;
};

const CF_API_KEY = process.env.CF_API_KEY;
const CF_BASE_URL = (process.env.CF_BASE_URL || 'https://api.commissionfactory.com').replace(/\/$/, '');

function toNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

function getArrayPayload<T>(payload: unknown, key: string): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === 'object' && Array.isArray((payload as Record<string, unknown>)[key])) {
    return (payload as Record<string, unknown>)[key] as T[];
  }
  return [];
}

async function fetchAffiliate<T>(endpoint: string, key: string): Promise<T[]> {
  if (!CF_API_KEY) throw new Error('CF_API_KEY is missing');

  const url = `${CF_BASE_URL}/V1/Affiliate/${endpoint}?apiKey=${encodeURIComponent(CF_API_KEY)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText} (${url})`);
  }

  const data = await response.json();
  return getArrayPayload<T>(data, key);
}

function generateSlug(name: string): string {
  return slugify(name).toLowerCase();
}

async function syncAdvertisers() {
  console.log('Syncing advertisers...');

  try {
    const advertisers = await fetchAffiliate<Merchant>('Merchants', 'Merchants');

    for (const adv of advertisers) {
      if (!adv.Name) continue;

      const slug = generateSlug(adv.Name);

      await execute(
        `INSERT INTO advertisers (external_id, name, slug, logo_url, commission_rate, avg_order_value, conversion_rate, epc, status, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           slug = VALUES(slug),
           logo_url = VALUES(logo_url),
           commission_rate = VALUES(commission_rate),
           avg_order_value = VALUES(avg_order_value),
           conversion_rate = VALUES(conversion_rate),
           epc = VALUES(epc),
           status = VALUES(status),
           updated_at = CURRENT_TIMESTAMP`,
        [
          String(adv.Id),
          adv.Name,
          slug,
          adv.AvatarUrl || null,
          adv.CommissionRate || null,
          null,
          0,
          0,
          'active',
        ]
      );
    }

    console.log(`Synced ${advertisers.length} advertisers`);
    await cacheDelete('advertisers:all');
  } catch (error) {
    console.error('Error syncing advertisers:', error);
  }
}

async function syncOffers() {
  console.log('Syncing offers...');

  try {
    const coupons = await fetchAffiliate<Coupon>('Coupons', 'Coupons');

    let imported = 0;
    for (const offer of coupons) {
      if (!offer.MerchantId || !offer.TargetUrl || !offer.TrackingUrl) continue;

      const advertiserResult = await query<{ id: number }>(
        'SELECT id FROM advertisers WHERE external_id = ?',
        [String(offer.MerchantId)]
      );

      if (advertiserResult.length === 0) continue;

      const advertiserId = advertiserResult[0].id;
      const endDate = offer.EndDate ? new Date(offer.EndDate) : null;
      const isExpired = endDate ? endDate < new Date() : false;
      const title = offer.Description || offer.Code || 'Coupon';

      await execute(
        `INSERT INTO offers (external_id, advertiser_id, title, description, coupon_code, destination_url, tracking_url, start_date, end_date, is_verified, is_expired, category, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
         ON DUPLICATE KEY UPDATE
           title = VALUES(title),
           description = VALUES(description),
           coupon_code = VALUES(coupon_code),
           destination_url = VALUES(destination_url),
           tracking_url = VALUES(tracking_url),
           start_date = VALUES(start_date),
           end_date = VALUES(end_date),
           is_verified = VALUES(is_verified),
           is_expired = VALUES(is_expired),
           category = VALUES(category),
           updated_at = CURRENT_TIMESTAMP`,
        [
          String(offer.Id),
          advertiserId,
          title,
          toNull(offer.Description),
          toNull(offer.Code),
          offer.TargetUrl,
          offer.TrackingUrl,
          offer.StartDate ? new Date(offer.StartDate) : null,
          endDate,
          1,
          isExpired ? 1 : 0,
          toNull(offer.Category),
        ]
      );

      imported++;
    }

    console.log(`Synced ${imported} offers`);
    await cacheDelete('offers:all');
    await cacheDelete('top-deals');
  } catch (error) {
    console.error('Error syncing offers:', error);
  }
}

async function syncCreatives() {
  console.log('Syncing creatives...');

  try {
    const banners = await fetchAffiliate<Banner>('Banners', 'Banners');

    let imported = 0;
    for (const creative of banners) {
      if (!creative.MerchantId || !creative.TrackingUrl) continue;

      const advertiserResult = await query<{ id: number }>(
        'SELECT id FROM advertisers WHERE external_id = ?',
        [String(creative.MerchantId)]
      );

      if (advertiserResult.length === 0) continue;

      const advertiserId = advertiserResult[0].id;

      await execute(
        `INSERT INTO creatives (external_id, advertiser_id, type, image_url, width, height, tracking_url, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
         ON DUPLICATE KEY UPDATE
           type = VALUES(type),
           image_url = VALUES(image_url),
           width = VALUES(width),
           height = VALUES(height),
           tracking_url = VALUES(tracking_url),
           updated_at = CURRENT_TIMESTAMP`,
        [
          String(creative.Id),
          advertiserId,
          creative.Size || 'banner',
          creative.ImageUrl || null,
          creative.Width || null,
          creative.Height || null,
          creative.TrackingUrl,
        ]
      );

      imported++;
    }

    console.log(`Synced ${imported} creatives`);
    await cacheDelete('creatives:all');
  } catch (error) {
    console.error('Error syncing creatives:', error);
  }
}

async function syncPromotionsAsOffers() {
  console.log('Syncing promotions...');

  try {
    const promotions = await fetchAffiliate<Promotion>('Promotions', 'Promotions');

    let imported = 0;
    for (const promo of promotions) {
      if (!promo.MerchantId || !promo.TargetUrl || !promo.TrackingUrl) continue;

      const advertiserResult = await query<{ id: number }>(
        'SELECT id FROM advertisers WHERE external_id = ?',
        [String(promo.MerchantId)]
      );

      if (advertiserResult.length === 0) continue;

      const advertiserId = advertiserResult[0].id;
      const endDate = promo.EndDate ? new Date(promo.EndDate) : null;
      const isExpired = endDate ? endDate < new Date() : false;
      const title = promo.Description || 'Promotion';

      await execute(
        `INSERT INTO offers (external_id, advertiser_id, title, description, coupon_code, destination_url, tracking_url, start_date, end_date, is_verified, is_expired, category, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
         ON DUPLICATE KEY UPDATE
           title = VALUES(title),
           description = VALUES(description),
           destination_url = VALUES(destination_url),
           tracking_url = VALUES(tracking_url),
           start_date = VALUES(start_date),
           end_date = VALUES(end_date),
           is_verified = VALUES(is_verified),
           is_expired = VALUES(is_expired),
           category = VALUES(category),
           updated_at = CURRENT_TIMESTAMP`,
        [
          String(promo.Id),
          advertiserId,
          title,
          toNull(promo.Description),
          null,
          promo.TargetUrl,
          promo.TrackingUrl,
          promo.StartDate ? new Date(promo.StartDate) : null,
          endDate,
          1,
          isExpired ? 1 : 0,
          toNull(promo.Category),
        ]
      );

      imported++;
    }

    console.log(`Synced ${imported} promotions`);
  } catch (error) {
    console.error('Error syncing promotions:', error);
  }
}

export async function fullSync() {
  console.log('Starting full sync...');

  await syncAdvertisers();
  await syncOffers();
  await syncCreatives();
  await syncPromotionsAsOffers();

  console.log('Full sync completed');
}

if (require.main === module) {
  fullSync().catch(console.error);
}
