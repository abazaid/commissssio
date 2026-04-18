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

export async function GET() {
  const cacheKey = 'advertisers:all';
  
  const cached = await cacheGet<Advertiser[]>(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }
  
  const advertisers = await query<Advertiser>(
    `SELECT * FROM advertisers WHERE status = 'active' ORDER BY name LIMIT 100`
  );
  
  await cacheSet(cacheKey, advertisers, 3600);
  
  return NextResponse.json(advertisers);
}