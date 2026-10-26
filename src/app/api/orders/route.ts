import { NextResponse } from 'next/server';
import { createOrder, getAllOrders, getOrder, deleteOrder, clearAllOrders } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';
import { verifyOrderSecret } from '@/lib/utils';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNo = (searchParams.get('order_no') || '').trim();
    const trackingToken = (
      searchParams.get('tracking_token') ||
      req.headers.get('x-tracking-token') ||
      ''
    ).trim();
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

    // 2. Customer access: strictly requires BOTH order_no AND unguessable secret tracking_token
    if (orderNo && trackingToken) {
      const order = await getOrder(orderNo, trackingToken);
      if (!order || !verifyOrderSecret(order, trackingToken)) {
        return NextResponse.json(
          { success: false, error: 'ไม่พบคำสั่งซื้อ หรือรหัสยืนยันไม่ถูกต้อง' },
          { status: 403 }
        );
      }
      return NextResponse.json({ success: true, order });
    }

    // 3. Public access without admin session or valid secret credentials is prohibited
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized: จำเป็นต้องเข้าสู่ระบบหลังบ้าน หรือระบุหมายเลขออเดอร์พร้อมรหัสยืนยัน',
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
      relationship_status,
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
      relationship_status,
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

export async function DELETE(req: Request) {
  try {
    const isAdmin = await verifyAdminSession(req);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: จำเป็นต้องเข้าสู่ระบบหลังบ้านเพื่อลบประวัติออเดอร์' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const orderNo = searchParams.get('order_no');
    const orderId = searchParams.get('id');
    const clearAll = searchParams.get('clear_all') === 'true';

    if (clearAll) {
      await clearAllOrders();
      return NextResponse.json({ success: true, message: 'ล้างประวัติคำสั่งซื้อทั้งหมดเรียบร้อยแล้ว' });
    }

    const target = orderNo || orderId;
    if (!target) {
      return NextResponse.json({ success: false, error: 'กรุณาระบุหมายเลขออเดอร์ที่ต้องการลบ' }, { status: 400 });
    }

    await deleteOrder(target);
    return NextResponse.json({ success: true, message: `ลบออเดอร์ ${target} สำเร็จเรียบร้อยแล้ว` });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการลบออเดอร์';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
