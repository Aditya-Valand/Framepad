import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PROTECTED_PAGES = ['/order'];
const PROTECTED_API   = ['/api/designs', '/api/orders', '/api/payments', '/api/account'];
const AUTH_REQUIRED_API = ['/api/designs', '/api/orders', '/api/payments', '/api/account', '/api/uploads'];
const ADMIN_PATHS     = ['/admin', '/api/admin'];

function getAccessSecret(): Uint8Array {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error('JWT_ACCESS_SECRET is not set');
  return new TextEncoder().encode(secret);
}

// Routes that bypass auth entirely (have their own verification)
const PUBLIC_API = ['/api/payments/webhook', '/api/pricing'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip auth for public/webhook routes
  if (PUBLIC_API.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const isProtectedPage = PROTECTED_PAGES.some((p) => pathname.startsWith(p));
  const isProtectedApi  = AUTH_REQUIRED_API.some((p) => pathname.startsWith(p));
  const isAdmin         = ADMIN_PATHS.some((p) => pathname.startsWith(p));

  // Admin routes require authentication + admin role check
  if (isAdmin) {
    const token = req.cookies.get('access_token')?.value;
    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/auth?redirect=' + encodeURIComponent(pathname), req.url));
    }
    try {
      const { payload } = await jwtVerify(token, getAccessSecret());
      const role = payload.role as string;
      const uid = payload.userId as string;
      const email = payload.email as string;
      const isBanned = payload.is_banned as boolean | undefined;

      if (isBanned) {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json({ error: 'Account suspended' }, { status: 403 });
        }
        const res = NextResponse.redirect(new URL('/auth?error=suspended', req.url));
        res.cookies.set('access_token', '', { maxAge: 0, path: '/' });
        res.cookies.set('refresh_token', '', { maxAge: 0, path: '/api/auth/refresh' });
        return res;
      }

      if (role !== 'admin') {
        return pathname.startsWith('/api/')
          ? NextResponse.json({ error: 'Forbidden' }, { status: 403 })
          : NextResponse.redirect(new URL('/404', req.url));
      }

      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('x-user-id', uid);
      requestHeaders.set('x-user-role', role);
      requestHeaders.set('x-user-email', email);
      return NextResponse.next({ request: { headers: requestHeaders } });
    } catch {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/auth?redirect=' + encodeURIComponent(pathname), req.url));
    }
  }

  const token = req.cookies.get('access_token')?.value;

  // No token: block protected routes, pass-through others
  if (!token) {
    if (isProtectedApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (isProtectedPage) {
      return NextResponse.redirect(
        new URL(`/auth?redirect=${encodeURIComponent(pathname)}`, req.url)
      );
    }
    return NextResponse.next();
  }

  try {
    const { payload } = await jwtVerify(token, getAccessSecret());
    const userId = payload.userId as string;
    const role   = payload.role   as string;
    const email  = payload.email  as string;
    const isBanned = payload.is_banned as boolean | undefined;

    if (isBanned) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Account suspended' }, { status: 403 });
      }
      const res = NextResponse.redirect(new URL('/auth?error=suspended', req.url));
      res.cookies.set('access_token', '', { maxAge: 0, path: '/' });
      res.cookies.set('refresh_token', '', { maxAge: 0, path: '/api/auth/refresh' });
      return res;
    }

    if (isAdmin && role !== 'admin') {
      return pathname.startsWith('/api/')
        ? NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        : NextResponse.redirect(new URL('/404', req.url));
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id',    userId);
    requestHeaders.set('x-user-role',  role);
    requestHeaders.set('x-user-email', email);

    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch {
    // Access token invalid or expired
    if (isProtectedApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (isProtectedPage) {
      return NextResponse.redirect(
        new URL(`/api/auth/refresh?next=${encodeURIComponent(pathname)}`, req.url)
      );
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/order/:path*',
    '/admin/:path*',
    '/api/designs/:path*',
    '/api/orders/:path*',
    '/api/payments/:path*',
    '/api/account/:path*',
    '/api/admin/:path*',
    '/api/uploads/:path*',
  ],
};
