import { NextResponse } from 'next/server';
import { getTopDeals } from '@/lib/ranking';
import { cacheGet, cacheSet } from '@/lib/redis';

export async function GET() {
  const cacheKey = 'top-deals';
  
  const cached = await cacheGet(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }
  
  const deals = await getTopDeals(20);
  
  await cacheSet(cacheKey, deals, 1800);
  
  return NextResponse.json(deals);
}