import { NextRequest, NextResponse } from 'next/server';

const apexDomain = process.env.NEXT_PUBLIC_SITE_HOST || 'aussiedealz.com';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const proto = request.headers.get('x-forwarded-proto') || '';
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    return NextResponse.next();
  }

  if (host.startsWith('www.')) {
    const url = new URL(request.url);
    url.host = apexDomain;
    return NextResponse.redirect(url, 301);
  }

  if (proto && proto !== 'https') {
    const url = new URL(request.url);
    url.protocol = 'https:';
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
