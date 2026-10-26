import { NextResponse } from 'next/server';
import {
  getAllQueues,
  getAllOrders,
  getQueueByOrder,
  updateQueueStatus,
  addManualQueue,
  deleteQueue,
  clearCompletedQueues,
  getOrder,
  getStoreData,
} from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';
import {
  maskName,
  getEstimatedWaitTime,
  formatQueueNo,
  verifyOrderSecret,
} from '@/lib/utils';
import { Order, PublicQueueItem, QueueItem } from '@/types';
import { dispatchShopNotification } from '@/lib/notifications';

function buildVirtualQueueFromOrder(order: Order, virtualQueueNo?: number): QueueItem {
  const trimmedNo = (order.order_no || '').trim().replace(/^#/, '');
  const fallbackSeqNo = /^\d+$/.test(trimmedNo) ? parseInt(trimmedNo, 10) : 0;
  const seqNo =
    typeof virtualQueueNo === 'number' && virtualQueueNo > 0
      ? virtualQueueNo
      : fallbackSeqNo;
  const itemsSummary = (order.items || []).map((i) => `${i.name} x${i.quantity}`).join(', ');
  const isExpress = Boolean(order.is_express);

  return {
    id: `pending-${order.id}`,
    queue_no: seqNo,
    order_id: order.id,
    order_no: order.order_no,
    customer_name: order.customer_name,
    items_summary: isExpress ? `⚡ [ลัดคิว] ${itemsSummary}` : itemsSummary,
    contact_info: `${order.contact_channel}: ${order.contact_value}`,
    contact_channel: order.contact_channel,
    contact_value: order.contact_value,
    status: order.status === 'cancelled' ? 'ยกเลิก' : 'รอตรวจสลิป',
    is_express: isExpress,
    estimated_time: getEstimatedWaitTime(order.items || [], isExpress),
    shop_note:
      order.status === 'pending_verification'
        ? 'ได้รับสลิปการโอนเงินแล้ว กำลังรอแอดมินตรวจสอบและนำเข้าคิวค่ะ 🍎'
        : 'รอแจ้งโอนเงินและแนบสลิปการโอนเงินค่ะ',
    is_manual: false,
    is_archived: false,
    created_at: order.created_at,
    updated_at: order.updated_at,
  };
}

async function computeNextVirtualQueueNoForOrder(order: Order): Promise<number> {
  const [allQueues, allOrders] = await Promise.all([getAllQueues(), getAllOrders()]);
  const maxQueueNo = allQueues.reduce((max, q) => Math.max(max, Number(q.queue_no) || 0), 0);
  const existingOrderNos = new Set(allQueues.map((q) => q.order_no));
  const pendingOrders = allOrders
    .filter((o) => o.status === 'pending_verification' && !existingOrderNos.has(o.order_no))
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  const idx = pendingOrders.findIndex((o) => o.id === order.id || o.order_no === order.order_no);
  return maxQueueNo + (idx >= 0 ? idx + 1 : pendingOrders.length + 1);
}

function toPublicQueueItem(q: QueueItem): PublicQueueItem {
  return {
    id: q.id,
    queue_no: q.queue_no,
    order_no: formatQueueNo(q.order_no || q.queue_no),
    customer_name: maskName(q.customer_name),
    status: q.status,
    is_express: Boolean(q.is_express),
    estimated_time: q.estimated_time || '',
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNo = (searchParams.get('order_no') || '').trim();
    const hasTrackingTokenParam =
      searchParams.has('tracking_token') || req.headers.has('x-tracking-token');
    const rawTrackingToken =
      searchParams.get('tracking_token') ?? req.headers.get('x-tracking-token');
    const trackingToken = rawTrackingToken !== null ? rawTrackingToken.trim() : '';
    const isPublicBoardRequest = searchParams.get('public') === '1';
    const isAdmin = await verifyAdminSession(req);

    // 1. If a tracking_token is supplied, strictly verify it FIRST before querying or returning any queue data
    if (hasTrackingTokenParam) {
      if (!orderNo) {
        return NextResponse.json(
          { success: false, error: 'กรุณาระบุหมายเลขคำสั่งซื้อ' },
          { status: 400 }
        );
      }

      if (!isAdmin) {
        const order = await getOrder(orderNo, trackingToken);
        if (!order || !verifyOrderSecret(order, trackingToken)) {
          return NextResponse.json(
            { success: false, error: 'ไม่พบข้อมูลคำสั่งซื้อ หรือรหัสติดตามไม่ถูกต้อง' },
            { status: 403 }
          );
        }

        const queue = await getQueueByOrder(order.order_no);
        if (queue) {
          return NextResponse.json({ success: true, queue });
        }
        const vQueueNo = await computeNextVirtualQueueNoForOrder(order);
        return NextResponse.json({
          success: true,
          queue: buildVirtualQueueFromOrder(order, vQueueNo),
        });
      }
    }

    // 2. Specific order/queue lookup without tracking_token
    if (orderNo) {
      // 2a. Admin lookup: can view full queue details
      if (isAdmin && !isPublicBoardRequest) {
        const order = await getOrder(orderNo);
        const queue = await getQueueByOrder(order ? order.order_no : orderNo);
        if (queue) {
          return NextResponse.json({ success: true, queue });
        }
        if (order) {
          const vQueueNo = await computeNextVirtualQueueNoForOrder(order);
          return NextResponse.json({
            success: true,
            queue: buildVirtualQueueFromOrder(order, vQueueNo),
          });
        }
        return NextResponse.json(
          { success: false, error: 'ไม่พบรายการคิวสำหรับหมายเลขนี้' },
          { status: 404 }
        );
      }

      // 2b. Public lookup by sequential number (order_no) alone:
      // Return ONLY status and estimated time (never full name, contact info, question, address, slip, or notes)
      const queue = await getQueueByOrder(orderNo);
      if (queue && queue.status !== 'ยกเลิก') {
        return NextResponse.json({
          success: true,
          queue: toPublicQueueItem(queue),
        });
      }

      const order = await getOrder(orderNo);
      if (order && order.status !== 'cancelled') {
        const vQueueNo = await computeNextVirtualQueueNoForOrder(order);
        const vq = buildVirtualQueueFromOrder(order, vQueueNo);
        return NextResponse.json({
          success: true,
          queue: toPublicQueueItem(vq),
        });
      }

      return NextResponse.json(
        { success: false, error: 'ไม่พบรายการคิวสำหรับหมายเลขนี้' },
        { status: 404 }
      );
    }

    // 3. Admin full queue list (when not explicitly requesting the public board)
    if (isAdmin && !isPublicBoardRequest) {
      const queues = await getAllQueues();
      return NextResponse.json({ success: true, queues });
    }

    // 4. Public queue board access: sanitize personal data, include pending_verification orders as 'รอตรวจสลิป', and hide archived completed queues
    const [allQueues, allOrders] = await Promise.all([getAllQueues(), getAllOrders()]);
    const existingOrderNos = new Set(allQueues.map((q) => q.order_no));
    const maxQueueNo = allQueues.reduce((max, q) => Math.max(max, Number(q.queue_no) || 0), 0);

    const activeQueues = allQueues.filter(
      (q) => !q.is_archived && q.status !== 'ยกเลิก'
    );

    const pendingSlipQueues: PublicQueueItem[] = allOrders
      .filter(
        (o) =>
          o.status === 'pending_verification' &&
          !existingOrderNos.has(o.order_no)
      )
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((o, idx) => toPublicQueueItem(buildVirtualQueueFromOrder(o, maxQueueNo + idx + 1)));

    const sanitizedQueues: PublicQueueItem[] = [
      ...activeQueues.map((q) => toPublicQueueItem(q)),
      ...pendingSlipQueues,
    ].sort((a, b) => a.queue_no - b.queue_no);

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
    const {
      action,
      queue_id,
      status,
      estimated_time,
      shop_note,
      is_express,
      is_archived,
      manual_data,
    } = body;

    if (action === 'clear_completed') {
      const result = await clearCompletedQueues();
      return NextResponse.json({
        success: true,
        deleted_count: result.deletedCount,
        queues: result.remainingQueues,
      });
    }

    if (action === 'add_manual' && manual_data) {
      const newQueue = await addManualQueue(manual_data);
      return NextResponse.json({ success: true, queue: newQueue });
    }

    if (action === 'update_status' && queue_id && status) {
      const updated = await updateQueueStatus(
        queue_id,
        status,
        estimated_time,
        shop_note,
        is_express,
        is_archived
      );

      // Notify Shop LINE / Webhook
      try {
        const storeData = await getStoreData();
        if (storeData?.settings?.notify_on_queue === true) {
          const queueNotice = `✨ [${storeData?.settings?.shop_name || 'Auralune'}] อัปเดตสถานะคิวแล้ว\n━━━━━━━━━━━━━━━━━━━━\nคิวที่ #${formatQueueNo(updated.queue_no)} (คุณ ${updated.customer_name})\n🔮 สถานะ: "${updated.status}"\n${updated.shop_note ? `📝 โน้ต: ${updated.shop_note}\n` : ''}⏱️ เวลา: ${updated.estimated_time || '-'}`;
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
    const clearCompleted = searchParams.get('clear_completed') === 'true';
    const queueId = searchParams.get('id');

    if (clearCompleted) {
      const result = await clearCompletedQueues();
      return NextResponse.json({
        success: true,
        deleted_count: result.deletedCount,
        queues: result.remainingQueues,
        message: `ลบคิวเสร็จแล้วทั้งหมด ${result.deletedCount} รายการ และจัดเลขคิวใหม่เรียบร้อยแล้ว`,
      });
    }

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
