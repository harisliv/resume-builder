import { authkit } from '@workos-inc/authkit-nextjs';
import { type NextRequest, NextResponse } from 'next/server';

/** Routes restricted to admin role only. */
const ADMIN_ONLY_PATHS = ['/compare'];

/** Paths that don't require authentication. */
const UNAUTHENTICATED_PATHS = ['/', '/sign-in', '/sign-up', '/callback'];

export default async function middleware(request: NextRequest) {
  const redirectUri =
    process.env.VERCEL_ENV === 'preview'
      ? `https://${process.env.VERCEL_URL}/callback`
      : process.env.VERCEL_ENV === 'production'
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/callback`
        : undefined;

  const { session, headers: authkitHeaders, authorizationUrl } = await authkit(request, {
    redirectUri
  });

  const { pathname } = new URL(request.url);

  const isUnauthenticated = UNAUTHENTICATED_PATHS.some((p) => pathname === p);

  // Redirect unauthenticated users on protected routes
  if (!isUnauthenticated && !session.user && authorizationUrl) {
    const response = NextResponse.redirect(authorizationUrl);
    for (const [key, value] of authkitHeaders) {
      if (key.toLowerCase() === 'set-cookie') {
        response.headers.append(key, value);
      } else {
        response.headers.set(key, value);
      }
    }
    return response;
  }

  // Block non-admin users from admin-only routes
  if (ADMIN_ONLY_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    if (session.role !== 'admin') {
      const response = NextResponse.redirect(new URL('/', request.url));
      for (const [key, value] of authkitHeaders) {
        if (key.toLowerCase() === 'set-cookie') {
          response.headers.append(key, value);
        } else {
          response.headers.set(key, value);
        }
      }
      return response;
    }
  }

  // Forward request with authkit headers
  const response = NextResponse.next({
    request: { headers: new Headers(request.headers) }
  });

  for (const [key, value] of authkitHeaders) {
    if (key.toLowerCase() === 'set-cookie') {
      response.headers.append(key, value);
    } else {
      response.headers.set(key, value);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ]
};
