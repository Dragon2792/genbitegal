import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Hanya proses rute /admin
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }
    const session = request.cookies.get('genbi_admin_session');
    if (!session?.value) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Catat pengunjung halaman utama (frontend) - lewat API route
  // Hanya untuk halaman, bukan asset/api
  const isPage = !pathname.startsWith('/api') &&
    !pathname.startsWith('/_next') &&
    !pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|map)$/);

  if (isPage) {
    // Ambil IP pengunjung
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    // Ambil User-Agent
    const userAgent = request.headers.get('user-agent') || '';

    // Tentukan jenis perangkat/browser
    let perangkat = 'Other';
    if (/googlebot/i.test(userAgent)) perangkat = 'Googlebot';
    else if (/bingbot/i.test(userAgent)) perangkat = 'Bing';
    else if (/yandexbot/i.test(userAgent)) perangkat = 'YandexBot';
    else if (/firefox/i.test(userAgent)) perangkat = 'Firefox';
    else if (/opr|opera/i.test(userAgent)) perangkat = 'Opera';
    else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) perangkat = 'Safari';
    else if (/chrome|chromium/i.test(userAgent)) perangkat = 'Chrome';
    else if (/msie|trident/i.test(userAgent)) perangkat = 'Internet Explorer';
    else if (/mozilla/i.test(userAgent)) perangkat = 'Mozilla';

    // Kirim ke API route untuk dicatat ke DB (non-blocking)
    const trackUrl = new URL('/api/track-visitor', request.url);
    fetch(trackUrl.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ip, perangkat }),
    }).catch(() => {}); // fire-and-forget, jangan blokir halaman
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
