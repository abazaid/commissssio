import { NextResponse } from 'next/server';

const key = process.env.INDEXNOW_KEY || 'aussiedealz-indexnow-key';

export function GET() {
  return new NextResponse(key, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
