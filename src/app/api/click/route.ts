import { NextResponse } from 'next/server';
import { execute, queryOne } from '@/lib/db';

type ClickPayload = {
  offerId: number | null;
  creativeId: number | null;
  subId: string | null;
  source: 'offer' | 'creative';
};

async function resolvePayload(
  offerIdRaw: string | null,
  creativeIdRaw: string | null,
  subIdRaw: string | null
): Promise<{ payload: ClickPayload; trackingUrl: string } | null> {
  const offerId = offerIdRaw ? Number(offerIdRaw) : NaN;
  const creativeId = creativeIdRaw ? Number(creativeIdRaw) : NaN;

  if (!Number.isNaN(offerId) && offerId > 0) {
    const offer = await queryOne<{ id: number; tracking_url: string }>(
      'SELECT id, tracking_url FROM offers WHERE id = ?',
      [offerId]
    );

    if (!offer) return null;

    return {
      payload: {
        offerId: offer.id,
        creativeId: null,
        subId: subIdRaw || null,
        source: 'offer',
      },
      trackingUrl: offer.tracking_url,
    };
  }

  if (!Number.isNaN(creativeId) && creativeId > 0) {
    const creative = await queryOne<{ id: number; tracking_url: string }>(
      'SELECT id, tracking_url FROM creatives WHERE id = ?',
      [creativeId]
    );

    if (!creative) return null;

    return {
      payload: {
        offerId: null,
        creativeId: creative.id,
        subId: subIdRaw || null,
        source: 'creative',
      },
      trackingUrl: creative.tracking_url,
    };
  }

  return null;
}

async function logClick(payload: ClickPayload, request: Request): Promise<void> {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : null;
  const userAgent = request.headers.get('user-agent') || null;

  const trackingSubId = payload.subId
    ? `${payload.source}:${payload.subId}`
    : `${payload.source}:${payload.offerId ?? payload.creativeId ?? 'unknown'}`;

  await execute(
    'INSERT INTO clicks (offer_id, sub_id, ip_address, user_agent) VALUES (?, ?, ?, ?)',
    [payload.offerId, trackingSubId, ipAddress, userAgent]
  );
}

function withSubId(url: string, subId: string | null): string {
  const trackingUrl = new URL(url);
  if (subId) {
    trackingUrl.searchParams.set('sub_id', subId);
  }
  return trackingUrl.toString();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const offerIdRaw = searchParams.get('offer_id');
    const creativeIdRaw = searchParams.get('creative_id');
    const subIdRaw = searchParams.get('sub_id');

    const resolved = await resolvePayload(offerIdRaw, creativeIdRaw, subIdRaw);

    if (!resolved) {
      return NextResponse.json(
        { error: 'offer_id or creative_id required and must exist' },
        { status: 400 }
      );
    }

    await logClick(resolved.payload, request);
    const destination = withSubId(resolved.trackingUrl, resolved.payload.subId);

    return NextResponse.redirect(destination, { status: 302 });
  } catch (error) {
    console.error('Click tracking GET error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const offerIdRaw = body.offer_id ? String(body.offer_id) : null;
    const creativeIdRaw = body.creative_id ? String(body.creative_id) : null;
    const subIdRaw = body.sub_id ? String(body.sub_id) : null;

    const resolved = await resolvePayload(offerIdRaw, creativeIdRaw, subIdRaw);
    if (!resolved) {
      return NextResponse.json(
        { error: 'offer_id or creative_id required and must exist' },
        { status: 400 }
      );
    }

    await logClick(resolved.payload, request);
    const destination = withSubId(resolved.trackingUrl, resolved.payload.subId);

    return NextResponse.json(
      { url: destination, source: resolved.payload.source },
      { status: 200 }
    );
  } catch (error) {
    console.error('Click tracking POST error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
