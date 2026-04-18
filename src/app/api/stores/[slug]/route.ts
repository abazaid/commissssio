import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cacheGet, cacheSet } from '@/lib/redis';

interface Advertiser {
  id: number;
  external_id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  commission_rate: number | null;
  avg_order_value: number | null;
  conversion_rate: number | null;
  epc: number | null;
  status: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const cacheKey = `advertiser:${slug}`;
  
  const cached = await cacheGet<Advertiser>(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }
  
  const advertisers = await query<Advertiser>(
    'SELECT * FROM advertisers WHERE slug = $1',
    [slug]
  );
  
  if (advertisers.length === 0) {
    return NextResponse.json({ error: 'Store not found' }, { status: 404 });
  }
  
  const advertiser = advertisers[0];
  await cacheSet(cacheKey, advertiser, 3600);
  
  return NextResponse.json(advertiser);
}