import { NextResponse } from 'next/server';
import {
  verifyAdminSession,
  verifyAdminPassword,
  setAdminPassword,
  hasCustomAdminPassword,
  createSessionToken,
  getCookieOptions,
  ADMIN_COOKIE_NAME,
} from '@/lib/auth';

export async function GET() {
  const hasCustom = await hasCustomAdminPassword();
  return NextResponse.json({
    success: true,
    has_custom_password: hasCustom,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { new_password, current_password } = body;

    if (!new_password || typeof new_password !== 'string' || new_password.trim().length < 4) {
      return NextResponse.json(
        { success: false, error: 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 4 ตัวอักษร' },
        { status: 400 }
      );
    }

    const cleanNewPass = new_password.trim();
    const isSessionValid = await verifyAdminSession(req);
    const hasCustom = await hasCustomAdminPassword();

    // If not authenticated via session, verify permission to set/change
    if (!isSessionValid) {
      if (hasCustom) {
        // If already set, must provide current password or master pin
        if (!current_password || !(await verifyAdminPassword(current_password.trim()))) {
          return NextResponse.json(
            { success: false, error: 'รหัสผ่านเดิมไม่ถูกต้อง' },
            { status: 401 }
          );
        }
      } else {
        // First-time setup: if current_password was supplied, verify it if they provided one
        if (current_password && !(await verifyAdminPassword(current_password.trim()))) {
          return NextResponse.json(
            { success: false, error: 'รหัสผ่านเริ่มต้นไม่ถูกต้อง' },
            { status: 401 }
          );
        }
      }
    }

    // Save the new password to database
    const saved = await setAdminPassword(cleanNewPass);
    if (!saved) {
      return NextResponse.json(
        { success: false, error: 'ไม่สามารถบันทึกรหัสผ่านใหม่ได้' },
        { status: 500 }
      );
    }

    // Generate new session token and set cookie
    const token = createSessionToken();
    const response = NextResponse.json({
      success: true,
      message: 'ตั้งรหัสผ่านใหม่สำเร็จเรียบร้อยแล้ว',
      token,
    });

    if (token) {
      const proto = req.headers.get('x-forwarded-proto');
      const url = new URL(req.url);
      const isHttps =
        proto === 'https' ||
        url.protocol === 'https:' ||
        Boolean(process.env.NEXT_PUBLIC_APP_URL?.startsWith('https'));

      response.cookies.set(ADMIN_COOKIE_NAME, token, getCookieOptions(isHttps));
    }

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการตั้งรหัสผ่าน';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
