import { NextResponse } from 'next/server';
import {
  getAllQueues,
  getQueueByOrder,
  updateQueueStatus,
  addManualQueue,
  deleteQueue,
  getOrder,
  getStoreData,
} from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';
import { maskName } from '@/lib/utils';
import { PublicQueueItem } from '@/types';
import { dispatchShopNotification } from '@/lib/notifications';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNo = searchParams.get('order_no');
    const trackingToken = searchParams.get('tracking_token') || req.headers.get('x-tracking-token');
    const isAdmin = await verifyAdminSession(req);

    // 1. Admin access: full queue details including contact info and private notes
    if (isAdmin) {
      if (orderNo) {
        const queue = await getQueueByOrder(orderNo);
        if (!queue) {
          return NextResponse.json(
            { success: false, error: 'ยังไม่พบคิวสำหรับหมายเลขออเดอร์นี้' },
            { status: 404 }
          );
        }
        return NextResponse.json({ success: true, queue });
      }

      const queues = await getAllQueues();
      return NextResponse.json({ success: true, queues });
    }

    // 2. Customer tracking access: requires order_no AND tracking_token
    if (orderNo && trackingToken) {
      const order = await getOrder(orderNo, trackingToken);
      if (!order) {
        return NextResponse.json(
          { success: false, error: 'ไม่พบข้อมูลคำสั่งซื้อ หรือรหัสติดตามไม่ถูกต้อง' },
          { status: 404 }
        );
      }

      const queue = await getQueueByOrder(orderNo);
      if (!queue) {
        return NextResponse.json(
          { success: false, error: 'ยังไม่พบคิวสำหรับออเดอร์นี้ กรุณารอร้านค้ายืนยันการชำระเงิน' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, queue });
    }

    // 3. Public queue board access: sanitize all personal data (mask customer names, omit contact info & full order numbers)
    const allQueues = await getAllQueues();
    const sanitizedQueues: PublicQueueItem[] = allQueues.map((q) => ({
      id: q.id,
      queue_no: q.queue_no,
      customer_name: maskName(q.customer_name),
      status: q.status,
      is_express: q.is_express,
      estimated_time: q.estimated_time,
    }));

    return NextResponse.json({ success: true, queues: sanitizedQueues });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการดึงข้อมูลคิว';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const isAdmin = await verifyAdminSession(req);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: จำเป็นต้องเข้าสู่ระบบหลังบ้านเพื่อจัดการคิว' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { action, queue_id, status, estimated_time, shop_note, is_express, manual_data } = body;

    if (action === 'add_manual' && manual_data) {
      const newQueue = await addManualQueue(manual_data);
      return NextResponse.json({ success: true, queue: newQueue });
    }

    if (action === 'update_status' && queue_id && status) {
      const updated = await updateQueueStatus(queue_id, status, estimated_time, shop_note, is_express);

      // Notify Shop LINE / Webhook
      try {
        const storeData = await getStoreData();
        if (storeData?.settings?.notify_on_queue !== false) {
          const queueNotice = `✨ [${storeData?.settings?.shop_name || 'Auralune'}] อัปเดตสถานะคิวแล้ว\n━━━━━━━━━━━━━━━━━━━━\nคิวที่ #${updated.queue_no} (คุณ ${updated.customer_name})\n🔮 สถานะ: "${updated.status}"\n${updated.shop_note ? `📝 โน้ต: ${updated.shop_note}\n` : ''}⏱️ เวลา: ${updated.estimated_time || '-'}`;
          dispatchShopNotification(queueNotice, storeData?.settings).catch((e) =>
            console.warn('Queue notification error:', e)
          );
        }
      } catch (e) {
        console.warn('Failed to dispatch queue notification:', e);
      }

      return NextResponse.json({ success: true, queue: updated });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการอัปเดตคิว';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const isAdmin = await verifyAdminSession(req);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: จำเป็นต้องเข้าสู่ระบบหลังบ้านเพื่อลบคิว' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const queueId = searchParams.get('id');

    if (!queueId) {
      return NextResponse.json({ success: false, error: 'Missing queue id' }, { status: 400 });
    }

    await deleteQueue(queueId);
    return NextResponse.json({ success: true, message: 'ลบคิวสำเร็จ' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการลบคิว';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
