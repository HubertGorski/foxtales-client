import { next } from '@vercel/edge';

export const config = {
  matcher: ['/share/memory/:path*', '/api/:path*'],
};

export default function middleware(request) {
  const apiKey = process.env.VERCEL_API_KEY;

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
