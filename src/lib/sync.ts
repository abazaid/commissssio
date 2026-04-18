import { query, execute } from './db';
import { cacheDelete } from './redis';
import slugify from 'slug';

interface CFAdvertiser {
  id: number;
  name: string;
  logoUrl: string;
  commissionAmount: number;
  commissionType: string;
  averageOrderValue: number;
  conversionRate: number;
  epc: number;
  status: string;
}

interface CFOffer {
  id: number;
  advertiserId: number;
  title: string;
  description: string;
  couponCode: string | null;
  destinationUrl: string;
  trackingUrl: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface CFCreative {
  id: number;
  advertiserId: number;
  type: string;
  imageUrl: string;
  width: number;
  height: number;
  trackingUrl: string;
}

const CF_API_KEY = process.env.CF_API_KEY;
const CF_BASE_URL = process.env.CF_BASE_URL || 'https://api.commissionfactory.com';

async function fetchWithAuth(endpoint: string) {
  const response = await fetch(`${CF_BASE_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${CF_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

function generateSlug(name: string): string {
  return slugify(name).toLowerCase();
}

async function syncAdvertisers() {
  console.log('Syncing advertisers...');
  
  try {
    const data = await fetchWithAuth('/v1/advertisers');
    const advertisers: CFAdvertiser[] = data.advertisers || data || [];
    
    for (const adv of advertisers) {
      const slug = generateSlug(adv.name);
      
      await execute(
        `INSERT INTO advertisers (external_id, name, slug, logo_url, commission_rate, avg_order_value, conversion_rate, epc, status, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          String(adv.id),
          adv.name,
          slug,
          adv.logoUrl || null,
          adv.commissionAmount || null,
          adv.averageOrderValue || null,
          adv.conversionRate || null,
          adv.epc || null,
          adv.status || 'active',
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
    const data = await fetchWithAuth('/v1/offers');
    const offers: CFOffer[] = data.offers || data || [];
    
    for (const offer of offers) {
      const advertiserResult = await query<{ id: number }>(
        'SELECT id FROM advertisers WHERE external_id = ?',
        [String(offer.advertiserId)]
      );
      
      if (advertiserResult.length === 0) continue;
      
      const advertiserId = advertiserResult[0].id;
      const now = new Date();
      const endDate = offer.endDate ? new Date(offer.endDate) : null;
      const isExpired = endDate ? endDate < now : false;
      
      await execute(
        `INSERT INTO offers (external_id, advertiser_id, title, description, coupon_code, destination_url, tracking_url, start_date, end_date, is_verified, is_expired, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
         ON DUPLICATE KEY UPDATE
           title = VALUES(title),
           description = VALUES(description),
           coupon_code = VALUES(coupon_code),
           destination_url = VALUES(destination_url),
           tracking_url = VALUES(tracking_url),
           start_date = VALUES(start_date),
           end_date = VALUES(end_date),
           is_expired = VALUES(is_expired),
           updated_at = CURRENT_TIMESTAMP`,
        [
          String(offer.id),
          advertiserId,
          offer.title,
          offer.description || null,
          offer.couponCode || null,
          offer.destinationUrl,
          offer.trackingUrl,
          offer.startDate ? new Date(offer.startDate) : null,
          endDate,
          1,
          isExpired ? 1 : 0,
        ]
      );
    }
    
    console.log(`Synced ${offers.length} offers`);
    await cacheDelete('offers:all');
    
    await markExpiredOffers();
  } catch (error) {
    console.error('Error syncing offers:', error);
  }
}

async function markExpiredOffers() {
  console.log('Marking expired offers...');
  
  await execute(
    `UPDATE offers SET is_expired = 1, updated_at = CURRENT_TIMESTAMP
     WHERE end_date < CURRENT_DATE AND is_expired = 0`
  );
}

async function syncCreatives() {
  console.log('Syncing creatives...');
  
  try {
    const data = await fetchWithAuth('/v1/creatives');
    const creatives: CFCreative[] = data.creatives || data || [];
    
    for (const creative of creatives) {
      const advertiserResult = await query<{ id: number }>(
        'SELECT id FROM advertisers WHERE external_id = ?',
        [String(creative.advertiserId)]
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
          String(creative.id),
          advertiserId,
          creative.type,
          creative.imageUrl || null,
          creative.width || null,
          creative.height || null,
          creative.trackingUrl,
        ]
      );
    }
    
    console.log(`Synced ${creatives.length} creatives`);
    await cacheDelete('creatives:all');
  } catch (error) {
    console.error('Error syncing creatives:', error);
  }
}

export async function fullSync() {
  console.log('Starting full sync...');
  
  await syncAdvertisers();
  await syncOffers();
  await syncCreatives();
  
  console.log('Full sync completed');
}

if (require.main === module) {
  fullSync().catch(console.error);
}