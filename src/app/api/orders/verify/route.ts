import { NextResponse } from 'next/server';
import { confirmOrderPayment } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const isAdmin = await verifyAdminSession(req);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: จำเป็นต้องเข้าสู่ระบบหลังบ้านเพื่อยืนยันการชำระเงิน' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { order_id } = body;

    if (!order_id) {
      return NextResponse.json({ success: false, error: 'กรุณาระบุ order_id' }, { status: 400 });
    }

    const result = await confirmOrderPayment(order_id);
    return NextResponse.json({
      success: true,
      message: 'ยืนยันการชำระเงินและนำเข้าคิวสำเร็จ',
      data: result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการยืนยันคำสั่งซื้อ';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
