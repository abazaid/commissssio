import { NextResponse } from 'next/server';
import { execute, queryOne } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { offer_id, sub_id } = body;
    
    if (!offer_id) {
      return NextResponse.json({ error: 'offer_id required' }, { status: 400 });
    }
    
    const offer = await queryOne<{ id: number; tracking_url: string }>(
      'SELECT id, tracking_url FROM offers WHERE id = $1',
      [offer_id]
    );
    
    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }
    
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : null;
    const userAgent = request.headers.get('user-agent') || null;
    
    await execute(
      'INSERT INTO clicks (offer_id, sub_id, ip_address, user_agent) VALUES ($1, $2, $3, $4)',
      [offer_id, sub_id || null, ipAddress, userAgent]
    );
    
    const trackingUrl = new URL(offer.tracking_url);
    if (sub_id) {
      trackingUrl.searchParams.set('sub_id', sub_id);
    }
    
    return NextResponse.json({ url: trackingUrl.toString() });
  } catch (error) {
    console.error('Click tracking error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}