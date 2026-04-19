import { NextRequest, NextResponse } from 'next/server';
import { submitIndexNow } from '@/lib/indexnow';

export async function POST(request: NextRequest) {
  const apiSecret = process.env.INDEXNOW_API_SECRET;
  const authHeader = request.headers.get('authorization');
  const bearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (apiSecret && bearer !== apiSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const urls = Array.isArray((body as { urls?: unknown[] })?.urls)
    ? ((body as { urls: unknown[] }).urls.filter((url): url is string => typeof url === 'string'))
    : [];

  if (urls.length === 0) {
    return NextResponse.json({ error: 'Provide urls array with at least one path' }, { status: 400 });
  }

  await submitIndexNow(urls);

  return NextResponse.json({ success: true, submitted: urls.length });
}

