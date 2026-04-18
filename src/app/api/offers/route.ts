import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cacheGet, cacheSet } from '@/lib/redis';

interface Offer {
  id: number;
  external_id: string;
  advertiser_id: number;
  title: string;
  description: string | null;
  coupon_code: string | null;
  destination_url: string;
  tracking_url: string;
  start_date: Date | null;
  end_date: Date | null;
  is_verified: boolean;
  is_expired: boolean;
  category: string | null;
  advertiser_name: string;
  advertiser_slug: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const limitParam = Number(searchParams.get('limit') || 100);
  const safeLimit = Number.isFinite(limitParam) ? Math.max(1, Math.min(500, Math.floor(limitParam))) : 100;
  
  const cacheKey = category ? `offers:category:${category}` : 'offers:all';
  
  const cached = await cacheGet<Offer[]>(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }
  
  let whereClause = 'WHERE o.is_expired = 0 AND a.status = \'active\'';
  const params: unknown[] = [];
  
  if (category) {
    whereClause = 'WHERE o.is_expired = 0 AND a.status = \'active\' AND LOWER(o.category) = LOWER(?)';
    params.push(category);
  }
  
  const offers = await query<Offer>(
    `SELECT o.*, a.name as advertiser_name, a.slug as advertiser_slug
     FROM offers o
     JOIN advertisers a ON o.advertiser_id = a.id
     ${whereClause}
     ORDER BY o.created_at DESC
     LIMIT ${safeLimit}`,
    params
  );
  
  await cacheSet(cacheKey, offers, 1800);
  
  return NextResponse.json(offers);
}
