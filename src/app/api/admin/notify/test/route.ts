import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { dispatchShopNotification, sendLinePushMessage, sendWebhookMessage } from '@/lib/notifications';
import { StoreSettings } from '@/types';

export async function POST(req: Request) {
  try {
    const isAdmin = await verifyAdminSession(req);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: กรุณาเข้าสู่ระบบหลังบ้าน' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { line_channel_access_token, line_admin_user_id, webhook_url, shop_name } = body;

    const testMessage = `🍏 [${shop_name || 'Auralune'}] ทดสอบระบบแจ้งเตือนสำเร็จแล้วค่ะ!\n━━━━━━━━━━━━━━━━━━━━\nระบบเชื่อมต่อกับร้านค้าเรียบร้อยแล้ว ✨\nต่อไปเมื่อมีลูกค้าโอนเงินแนบสลิปเข้ามา ระบบจะส่งข้อความแจ้งเตือนมาที่นี่ทันทีค่ะ 🔔`;

    const results = [];

    // Test LINE if provided
    if (line_channel_access_token && line_admin_user_id) {
      const lineRes = await sendLinePushMessage(
        line_channel_access_token,
        line_admin_user_id,
        testMessage
      );
      results.push(lineRes);
      if (!lineRes.success) {
        return NextResponse.json({
          success: false,
          error: `ส่งเข้า LINE ไม่สำเร็จ: ${lineRes.error}. กรุณาตรวจสอบ Channel Access Token และ User ID / Group ID อีกครั้งค่ะ`,
        });
      }
    }

    // Test Webhook if provided
    if (webhook_url && webhook_url.startsWith('http')) {
      const hookRes = await sendWebhookMessage(webhook_url, testMessage);
      results.push(hookRes);
      if (!hookRes.success) {
        return NextResponse.json({
          success: false,
          error: `ส่งเข้า Webhook ไม่สำเร็จ: ${hookRes.error}`,
        });
      }
    }

    if (results.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'กรุณากรอก LINE Channel Access Token และ User ID หรือ Webhook URL ก่อนกดทดสอบค่ะ',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'ส่งข้อความทดสอบเข้า LINE / Webhook เรียบร้อยแล้วค่ะ! 🔔✨ ตรวจสอบแชทของคุณได้เลย',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการทดสอบแจ้งเตือน';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
