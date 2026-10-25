import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, getCookieOptions } from '@/lib/auth';

export async function POST(req: Request) {
  const response = NextResponse.json({
    success: true,
    message: 'ออกจากระบบสำเร็จ',
  });

  const proto = req.headers.get('x-forwarded-proto');
  const url = new URL(req.url);
  const isHttps =
    proto === 'https' ||
    url.protocol === 'https:' ||
    Boolean(process.env.NEXT_PUBLIC_APP_URL?.startsWith('https'));

  const cookieOpts = getCookieOptions(isHttps);
  response.cookies.set(ADMIN_COOKIE_NAME, '', {
    ...cookieOpts,
    maxAge: 0,
  });

  return response;
}
