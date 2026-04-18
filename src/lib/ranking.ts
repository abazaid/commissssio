import { query } from './db';

interface OfferWithAdvertiser {
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
  commission_rate: number | null;
  avg_order_value: number | null;
  conversion_rate: number | null;
  epc: number | null;
  clicks_count?: number;
  created_at?: Date;
  score?: number;
}

function calculateClickScore(clicksCount: number, maxScore: number = 10): number {
  if (clicksCount === 0) return 0;
  if (clicksCount < 10) return 1;
  if (clicksCount < 50) return 3;
  if (clicksCount < 100) return 5;
  if (clicksCount < 500) return 7;
  return Math.min(maxScore, clicksCount / 100);
}

function calculateFreshnessScore(createdAt: Date | null): number {
  if (!createdAt) return 0;
  const daysOld = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
  if (daysOld < 1) return 10;
  if (daysOld < 7) return 8;
  if (daysOld < 14) return 6;
  if (daysOld < 30) return 4;
  return 2;
}

function calculateExpiryScore(endDate: Date | null): number {
  if (!endDate) return 5;
  const daysLeft = (new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  if (daysLeft < 0) return 0;
  if (daysLeft < 1) return 10;
  if (daysLeft < 3) return 8;
  if (daysLeft < 7) return 6;
  if (daysLeft < 14) return 4;
  return 2;
}

function calculateScore(offer: OfferWithAdvertiser): number {
  const epc = offer.epc ?? 0;
  const conversion = offer.conversion_rate ?? 0;
  const commission = offer.commission_rate ?? 0;
  const normalizedEpc = Math.min(10, epc * 10);
  const normalizedConversion = Math.min(10, conversion * 100);
  const normalizedCommission = Math.min(10, commission);
  const clicksScore = calculateClickScore(offer.clicks_count || 0);
  const verifiedScore = offer.is_verified === 1 ? 5 : 0;
  const expiryScore = calculateExpiryScore(offer.end_date);
  const freshnessScore = calculateFreshnessScore(offer.created_at || null);
  
  const score =
    (normalizedEpc * 0.4) +
    (normalizedConversion * 0.3) +
    (normalizedCommission * 0.2) +
    (freshnessScore * 0.1) +
    (clicksScore * 0.05) +
    (verifiedScore * 0.03) +
    (expiryScore * 0.02);
  
  return Math.round(score * 100) / 100;
}

export async function getRankedOffers(
  limit = 50,
  category?: string,
  advertiserSlug?: string
): Promise<OfferWithAdvertiser[]> {
  const queryLimit = Math.max(limit * 4, 100);
  const params: unknown[] = [];
  let categoryFilter = '';
  let advertiserFilter = '';
  
  if (category) {
    categoryFilter = 'AND LOWER(o.category) = LOWER(?)';
    params.push(category);
  }

  if (advertiserSlug) {
    advertiserFilter = 'AND a.slug = ?';
    params.push(advertiserSlug);
  }

  params.push(queryLimit);
  
  const offers = await query<OfferWithAdvertiser>(
    `SELECT 
      o.id, o.title, o.description, o.coupon_code, o.destination_url, o.tracking_url,
      o.start_date, o.end_date, o.is_verified, o.is_expired, o.advertiser_id, o.category,
      o.created_at,
      a.name as advertiser_name, a.slug as advertiser_slug, a.logo_url, 
      COALESCE(a.commission_rate, 0) as commission_rate,
      COALESCE(a.avg_order_value, 0) as avg_order_value,
      COALESCE(a.conversion_rate, 0) as conversion_rate,
      COALESCE(a.epc, 0) as epc,
      COALESCE(c.clicks, 0) as clicks_count
    FROM offers o
    JOIN advertisers a ON o.advertiser_id = a.id
    LEFT JOIN (SELECT offer_id, COUNT(*) as clicks FROM clicks GROUP BY offer_id) c ON o.id = c.offer_id
    WHERE o.is_expired = 0 AND a.status = 'active' ${categoryFilter} ${advertiserFilter}
    GROUP BY o.id, a.id, c.clicks
    ORDER BY 
      o.created_at DESC,
      COALESCE(c.clicks, 0) DESC
    LIMIT ?`,
    params
  );
  
  return offers
    .map((offer) => ({
      ...offer,
      score: calculateScore(offer),
    }))
    .sort((a, b) => {
      const scoreDiff = (b.score || 0) - (a.score || 0);
      if (scoreDiff !== 0) return scoreDiff;
      if (a.is_verified !== b.is_verified) return b.is_verified - a.is_verified;
      if (!!a.coupon_code !== !!b.coupon_code) return a.coupon_code ? -1 : 1;
      return (b.clicks_count || 0) - (a.clicks_count || 0);
    })
    .slice(0, limit);
}

export async function getTopDeals(limit = 20): Promise<OfferWithAdvertiser[]> {
  return getRankedOffers(limit);
}

export async function getVerifiedCoupons(limit = 50): Promise<OfferWithAdvertiser[]> {
  const offers = await query<OfferWithAdvertiser>(
    `SELECT 
      o.id, o.title, o.description, o.coupon_code, o.destination_url, o.tracking_url,
      o.start_date, o.end_date, o.is_verified, o.is_expired, o.advertiser_id,
      o.created_at,
      a.name as advertiser_name, a.slug as advertiser_slug, a.logo_url, 
      COALESCE(a.commission_rate, 0) as commission_rate,
      COALESCE(c.clicks, 0) as clicks_count
    FROM offers o
    JOIN advertisers a ON o.advertiser_id = a.id
    LEFT JOIN (SELECT offer_id, COUNT(*) as clicks FROM clicks GROUP BY offer_id) c ON o.id = c.offer_id
    WHERE o.is_expired = 0 AND o.is_verified = 1 AND o.coupon_code IS NOT NULL AND a.status = 'active'
    GROUP BY o.id, a.id, c.clicks
    ORDER BY COALESCE(c.clicks, 0) DESC, o.id DESC
    LIMIT ?`,
    [limit]
  );
  
  return offers;
}

export async function getDiverseOffers(limit = 20, maxPerAdvertiser = 3): Promise<OfferWithAdvertiser[]> {
  const results: OfferWithAdvertiser[] = [];
  const seenAdvertisers: Record<number, number> = {};
  
  const allOffers = await getRankedOffers(100);
  
  for (const offer of allOffers) {
    if (results.length >= limit) break;
    
    const count = seenAdvertisers[offer.advertiser_id] || 0;
    if (count >= maxPerAdvertiser) continue;
    
    results.push(offer);
    seenAdvertisers[offer.advertiser_id] = count + 1;
  }
  
  return results;
}
