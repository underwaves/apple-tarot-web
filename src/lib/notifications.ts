import { Order, QueueItem, StoreSettings } from '@/types';
import { formatQueueNo } from './utils';

export interface SendResult {
  success: boolean;
  channel?: 'line' | 'webhook';
  error?: string;
}

/**
 * Send text message to LINE Messaging API (Push message to Admin / Group)
 */
export async function sendLinePushMessage(
  channelAccessToken: string,
  toUserId: string,
  text: string
): Promise<SendResult> {
  try {
    const res = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${channelAccessToken.trim()}`,
      },
      body: JSON.stringify({
        to: toUserId.trim(),
        messages: [
          {
            type: 'text',
            text: text,
          },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return {
        success: false,
        channel: 'line',
        error: `LINE API error (${res.status}): ${errText}`,
      };
    }

    return { success: true, channel: 'line' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, channel: 'line', error: msg };
  }
}

/**
 * Send message to generic webhook (e.g. Discord, Telegram, Make, Zapier)
 */
export async function sendWebhookMessage(
  webhookUrl: string,
  text: string
): Promise<SendResult> {
  try {
    const res = await fetch(webhookUrl.trim(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: text, // Discord format
        text: text,    // Slack / Generic format
      }),
    });

    if (!res.ok) {
      return {
        success: false,
        channel: 'webhook',
        error: `Webhook error status ${res.status}`,
      };
    }

    return { success: true, channel: 'webhook' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, channel: 'webhook', error: msg };
  }
}

/**
 * Dispatch notification to shop admin based on store settings
 */
export async function dispatchShopNotification(
  text: string,
  settings?: StoreSettings | null
): Promise<SendResult[]> {
  if (!settings) return [];
  const results: SendResult[] = [];

  // 1. LINE Messaging API
  if (settings.line_channel_access_token && settings.line_admin_user_id) {
    const lineRes = await sendLinePushMessage(
      settings.line_channel_access_token,
      settings.line_admin_user_id,
      text
    );
    results.push(lineRes);
  }

  // 2. Generic Webhook (Discord / Make / Zapier)
  if (settings.webhook_url && settings.webhook_url.startsWith('http')) {
    const hookRes = await sendWebhookMessage(settings.webhook_url, text);
    results.push(hookRes);
  }

  return results;
}

/**
 * Format notification for newly uploaded slip
 */
export function formatSlipNotificationMessage(
  order: Order,
  settings: StoreSettings
): string {
  const itemsText = (order.items || [])
    .map((item) => `• ${item.name} (x${item.quantity}) - ฿${item.price * item.quantity}`)
    .join('\n');

  const relStatus = order.relationship_status || order.birth_time;
  const fortuneInfo = [
    order.birth_date ? `🎂 วันเกิด: ${order.birth_date}` : null,
    relStatus ? `💕 สถานะความรัก: ${relStatus}` : null,
    order.zodiac_sign ? `♈ ราศี: ${order.zodiac_sign}` : null,
    order.question ? `🔮 คำถาม: "${order.question}"` : null,
  ]
    .filter(Boolean)
    .join('\n');

  const lines = [
    `🔔 [${settings.shop_name || 'Auralune'}] มีลูกค้าแนบสลิปใหม่รอตรวจ!`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `📋 บิลคำสั่งซื้อ: #${formatQueueNo(order.order_no)}`,
    `👤 ลูกค้า: คุณ ${order.customer_name}`,
    `💰 ยอดโอน: ฿${order.total_amount.toLocaleString()}`,
    order.is_express ? `⚡ ประเภทคิว: คิวด่วนพิเศษ (Express)` : `⏱️ ประเภทคิว: คิวปกติ`,
    `📱 ช่องทางติดต่อ: ${order.contact_channel} (${order.contact_value})`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `📦 รายการที่สั่งซื้อ:`,
    itemsText || '- ไม่มีข้อมูลสินค้า -',
    fortuneInfo ? `━━━━━━━━━━━━━━━━━━━━\n🔮 ข้อมูลดวงชะตา/คำถาม:\n${fortuneInfo}` : '',
    order.customer_note ? `📝 โน้ตจากลูกค้า: "${order.customer_note}"` : '',
    `━━━━━━━━━━━━━━━━━━━━`,
    `✨ สามารถเข้าสู่ระบบหลังบ้านเพื่อตรวจสอบสลิปและกดยืนยันคิวได้เลยค่ะ 🍎`,
  ];

  return lines.filter(Boolean).join('\n');
}

/**
 * Format notification message to send to CUSTOMER when queue status is updated
 */
export function formatCustomerQueueUpdateMessage(
  queue: QueueItem,
  shopName: string,
  hostUrl: string,
  _trackingToken?: string
): string {
  const cleanHost = hostUrl.replace(/\/+$/, '');
  const visibleNo = formatQueueNo(queue.order_no || queue.queue_no);

  const trackingLines = [
    `🔑 รหัสติดตามสถานะ: ${visibleNo}`,
    cleanHost
      ? `🔗 ตรวจสอบคิวของคุณได้ที่: ${cleanHost}/queue?order_no=${encodeURIComponent(visibleNo)}`
      : `💡 แจ้งเลขบิล #${visibleNo} เพื่อตรวจสอบสถานะคิวได้เลยนะคะ 💬`,
  ];

  const lines = [
    `สวัสดีค่ะคุณ ${queue.customer_name} 🍎`,
    `อัปเดตสถานะคิวดูดวงจากร้าน ${shopName} นะคะ ✨`,
    ``,
    `📋 คิวที่: #${formatQueueNo(queue.queue_no)} (บิลคำสั่งซื้อ: ${formatQueueNo(queue.order_no)})`,
    `🔮 สถานะปัจจุบัน: "${queue.status}"`,
    queue.estimated_time ? `⏱️ ระยะเวลาโดยประมาณ: ${queue.estimated_time}` : '',
    queue.shop_note ? `📝 ข้อความจากแม่หมอ: ${queue.shop_note}` : '',
    ``,
    ...trackingLines,
    ``,
    `ขอบคุณที่ไว้วางใจให้ ${shopName} ดูแลนะคะ 🌙🌷`,
  ];

  return lines.filter(Boolean).join('\n');
}
