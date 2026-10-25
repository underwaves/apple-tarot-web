import { NextResponse } from 'next/server';
import { createOrder, getAllOrders, getOrder } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNo = searchParams.get('order_no');
    const trackingToken = searchParams.get('tracking_token') || req.headers.get('x-tracking-token');
    const isAdmin = await verifyAdminSession(req);

    // 1. Admin access: can view all orders or search by order_no without tracking token
    if (isAdmin) {
      if (orderNo) {
        const order = await getOrder(orderNo);
        if (!order) {
          return NextResponse.json({ success: false, error: 'ไม่พบคำสั่งซื้อ' }, { status: 404 });
        }
        return NextResponse.json({ success: true, order });
      }

      const orders = await getAllOrders();
      return NextResponse.json({ success: true, orders });
    }

    // 2. Customer access: strictly requires BOTH order_no AND unguessable tracking_token
    if (orderNo && trackingToken) {
      const order = await getOrder(orderNo, trackingToken);
      if (!order) {
        return NextResponse.json(
          { success: false, error: 'ไม่พบคำสั่งซื้อ หรือรหัสติดตามไม่ถูกต้อง' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, order });
    }

    // 3. Public access without admin session or valid tracking credentials is prohibited
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized: จำเป็นต้องเข้าสู่ระบบหลังบ้าน หรือระบุหมายเลขออเดอร์พร้อมรหัสติดตามสถานะ',
      },
      { status: 401 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการดึงข้อมูลออเดอร์';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customer_name,
      order_type,
      birth_date,
      birth_time,
      zodiac_sign,
      question,
      shipping_name,
      shipping_phone,
      shipping_address,
      shipping_subdistrict,
      shipping_district,
      shipping_province,
      shipping_postal_code,
      customer_note,
      contact_channel,
      contact_value,
      items,
      is_express,
    } = body;

    if (!customer_name || !contact_channel || !contact_value || !items || !items.length) {
      return NextResponse.json(
        { success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน (ชื่อ ช่องทางติดต่อ และสินค้า)' },
        { status: 400 }
      );
    }

    const order = await createOrder({
      customer_name,
      order_type,
      birth_date,
      birth_time,
      zodiac_sign,
      question,
      shipping_name,
      shipping_phone,
      shipping_address,
      shipping_subdistrict,
      shipping_district,
      shipping_province,
      shipping_postal_code,
      customer_note,
      contact_channel,
      contact_value,
      items,
      is_express: Boolean(is_express),
    });

    return NextResponse.json({ success: true, order });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
