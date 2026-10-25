import { NextResponse } from 'next/server';
import {
  verifyAdminPassword,
  createSessionToken,
  getCookieOptions,
  ADMIN_COOKIE_NAME,
} from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password } = body;

    if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'ระบบหลังบ้านยังไม่ได้ตั้งค่า ADMIN_PASSWORD บนเซิร์ฟเวอร์' },
        { status: 500 }
      );
    }

    if (!password || !verifyAdminPassword(password.trim())) {
      return NextResponse.json(
        { success: false, error: 'รหัสผ่านหลังบ้านไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    const token = createSessionToken();
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'ไม่สามารถสร้างเซสชันได้' },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      token, // Also return token for test clients
    });

    const proto = req.headers.get('x-forwarded-proto');
    const url = new URL(req.url);
    const isHttps =
      proto === 'https' ||
      url.protocol === 'https:' ||
      Boolean(process.env.NEXT_PUBLIC_APP_URL?.startsWith('https'));

    response.cookies.set(ADMIN_COOKIE_NAME, token, getCookieOptions(isHttps));

    return response;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
