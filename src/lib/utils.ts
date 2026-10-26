/**
 * Utility functions for Apple Orchard Shop
 */
import crypto from 'crypto';
import { OrderItem } from '@/types';

export function formatBaht(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
    .format(amount)
    .replace('THB', '฿')
    .trim();
}

export function formatThaiDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export function generateOrderNo(seqNo?: number): string {
  if (typeof seqNo === 'number' && seqNo > 0) {
    return String(seqNo).padStart(5, '0');
  }
  const date = new Date();
  const yearShort = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const randomChars = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `APL-${yearShort}${month}${day}-${randomChars}`;
}

export function generateTrackingToken(): string {
  // Unguessable, cryptographically secure 8-digit random numeric token
  const n = crypto.randomInt(10000000, 100000000);
  return String(n);
}

export function formatQueueNo(no: number | string | undefined | null): string {
  if (no === undefined || no === null || no === '') return '-----';
  const parsed = typeof no === 'number' ? no : parseInt(String(no).replace(/^#/, ''), 10);
  if (!isNaN(parsed) && parsed > 0) {
    return String(parsed).padStart(5, '0');
  }
  return String(no);
}

export function getEstimatedWaitTime(
  items: { id?: string; name?: string; category_id?: string; product_type?: string }[],
  isExpress?: boolean
): string {
  const hasVoiceCall = items.some((i) => {
    const id = (i.id || '').toLowerCase();
    const name = i.name || '';
    const cat = (i.category_id || '').toLowerCase();
    return (
      cat === 'cat-2' ||
      id === 'pkg-4' ||
      id === 'pkg-5' ||
      id === 'pkg-6' ||
      name.includes('นาที') ||
      name.includes('น݁า݂ที') ||
      name.includes('โทร') ||
      name.includes('คุยสด')
    );
  });

  if (hasVoiceCall) {
    return '10 - 30 นาที (แม่หมอจะทักไปนัดเวลา)';
  }

  const hasExpressItem =
    Boolean(isExpress) ||
    items.some((i) => (i.id || '') === 'pkg-3' || (i.name || '').includes('ลัดคิว'));

  if (hasExpressItem) {
    return '1 - 3 ชม. (ส่วนมากเร็วกว่านั้น)';
  }

  const hasFortune = items.some((i) => i.product_type !== 'physical');
  if (hasFortune) {
    return '3 - 24 ชม. (ส่วนมากเร็วกว่านั้น)';
  }

  return '3 - 24 ชม. (ส่วนมากเร็วกว่านั้น)';
}

export function maskName(name: string): string {
  if (!name) return '***';
  const trimmed = name.trim();
  if (trimmed.length <= 2) return trimmed[0] + '*';
  return trimmed[0] + '*'.repeat(Math.min(trimmed.length - 2, 4)) + trimmed[trimmed.length - 1];
}

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return match ? match[1] : null;
}

export function formatBillText(order: {
  order_no: string;
  tracking_token?: string;
  customer_name: string;
  order_type?: string;
  birth_date?: string;
  birth_time?: string;
  relationship_status?: string;
  zodiac_sign?: string;
  question?: string;
  shipping_name?: string;
  shipping_phone?: string;
  shipping_address?: string;
  shipping_subdistrict?: string;
  shipping_district?: string;
  shipping_province?: string;
  shipping_postal_code?: string;
  items: OrderItem[];
  total_amount: number;
  is_express?: boolean;
  express_fee?: number;
  contact_channel: string;
  contact_value: string;
  customer_note?: string;
  queue_no?: number;
}): string {
  const isPhysical =
    order.order_type === 'physical' ||
    Boolean(order.shipping_address) ||
    order.items.some((i) => i.product_type === 'physical');

  const itemsText = order.items
    .map((item) => `- ${item.name} (${item.quantity} รายการ): ฿${(item.price * item.quantity).toLocaleString()}`)
    .join('\n');

  const waitTime = getEstimatedWaitTime(order.items, order.is_express);

  const lines = [
    `🍎 บิลคำสั่งซื้อ: ${order.order_no}`,
    order.tracking_token ? `🔑 รหัสติดตามสถานะ (ห้ามแชร์): ${order.tracking_token}` : '',
    order.queue_no ? `🏷️ คิวที่: #${formatQueueNo(order.queue_no)}` : '',
    `👤 ชื่อลูกค้า: ${order.customer_name}`,
  ];

  if (isPhysical && (order.shipping_name || order.shipping_address)) {
    const fullAddr = [
      order.shipping_address,
      order.shipping_subdistrict ? `ต./แขวง ${order.shipping_subdistrict}` : '',
      order.shipping_district ? `อ./เขต ${order.shipping_district}` : '',
      order.shipping_province ? `จ.${order.shipping_province}` : '',
      order.shipping_postal_code,
    ]
      .filter(Boolean)
      .join(' ');

    lines.push(
      `📦 ข้อมูลจัดส่งสินค้า:`,
      `   ผู้รับ: ${order.shipping_name || order.customer_name} (${order.shipping_phone || order.contact_value})`,
      `   ที่อยู่: ${fullAddr}`
    );
  }

  if (order.birth_date || order.relationship_status || order.birth_time || order.zodiac_sign || order.question) {
    if (order.birth_date) {
      lines.push(
        `🎂 วันเกิด: ${order.birth_date}`
      );
    }
    if (order.relationship_status || order.birth_time) {
      lines.push(
        `💕 สถานะความรัก: ${order.relationship_status || order.birth_time}`
      );
    }
    if (order.zodiac_sign) {
      lines.push(`♈ ราศี: ${order.zodiac_sign}`);
    }
    if (order.question) {
      lines.push(`🔮 เรื่องที่ต้องการดูดวง: ${order.question}`);
    }
  }

  lines.push(
    `📱 ช่องทางติดต่อ: ${order.contact_channel} (${order.contact_value})`,
    order.is_express ? '⚡ บริการลัดคิวพิเศษ: ใช่ (เรทเดียว 32 บาท)' : '',
    `⏱️ เวลารอรับบริการโดยประมาณ: ${waitTime}`,
    order.customer_note ? `📝 หมายเหตุ: ${order.customer_note}` : '',
    `🛒 รายการสินค้า:\n${itemsText}`,
    (order.is_express && (order.express_fee ?? 0) > 0)
      ? `⚡ ค่าบริการลัดคิว: ฿${order.express_fee?.toLocaleString()}`
      : '',
    `💰 ยอดชำระทั้งหมด: ฿${order.total_amount.toLocaleString()}`,
    `✨ ขอบคุณที่อุดหนุนสวนแอปเปิ้ลนะคะ ขอให้มีความสุขในทุกวันค่ะ ✨`
  );

  return lines.filter(Boolean).join('\n');
}
