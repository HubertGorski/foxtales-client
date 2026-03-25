import { next, redirect } from '@vercel/edge';

export const config = {
  matcher: ['/share/memory/:path*', '/api/:path*'],
};

export default function middleware(request) {
  const apiKey = process.env.VERCEL_API_KEY;
  const ua = request.headers.get('user-agent') || '';
  const isBot =
    ua.includes('facebookexternalhit') ||
    ua.includes('Facebot') ||
    ua.includes('Twitterbot') ||
    ua.includes('Discordbot') ||
    ua.includes('WhatsApp');

  const url = new URL(request.url);

  if (isBot && url.pathname.startsWith('/share/memory/')) {
    const apiUrl = `https://api.foxtales.cc${url.pathname}`;
    return redirect(apiUrl, 301);
  }

  if (apiKey) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('X-API-Key', apiKey);

    return next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return next();
}
