import fs from 'fs';
import path from 'path';
import { supabaseAdmin, isSupabaseConfigured } from './supabase';
import { isNeonConfigured, neonGet, neonSet } from './neon';
import {
  Category,
  Order,
  QueueItem,
  StoreSettings,
  MusicTrack,
  Review,
  QueueStatus,
  PackageItem,
  OrderType,
} from '@/types';
import { generateOrderNo, generateTrackingToken } from './utils';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

export interface LocalDatabase {
  settings: StoreSettings;
  categories: Category[];
  orders: Order[];
  queues: QueueItem[];
  music_tracks: MusicTrack[];
  reviews: Review[];
  admin_password_hash?: string;
  admin_password_salt?: string;
}

export const DEFAULT_STORE_DATA: LocalDatabase = {
  settings: {
    shop_name: 'Auralune',
    shop_title: 'Auralune · ดูดวงไพ่ทาโรต์พยากรณ์',
    shop_subtitle: 'เปิดไพ่ฮีลใจ แม่นยำ ตรงไปตรงมา · คำถามทั่วไป คำถามเจาะจง ดูดวงแบบโทรสด',
    banner_url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80',
    avatar_url: 'https://images.unsplash.com/photo-1568644396922-5c3bfae12521?auto=format&fit=crop&w=300&q=80',
    promptpay_id: '0968895279',
    account_name: 'ด.ญ. ณัฐธยาน์ ขันทอง',
    bank_name: 'ธนาคารกสิกรไทย (KBANK)',
    bank_account_no: '145-1-03659-5',
    truemoney_phone: '096-889-5279',
    qr_image_url: '/images/kbank_qr.png',
    contacts: [{ label: 'LINE Official', url: 'https://lin.ee/zTea2n2' }],
    socials: [
      { type: 'LINE', name: 'LINE Official', url: 'https://lin.ee/zTea2n2' },
      { type: 'Instagram', name: '@auralune_a', url: 'https://www.instagram.com/auralune_a?obrf=cGVvMzNnNDh2eWNk' },
      { type: 'Facebook', name: 'Auralune ดูดวงไพ่ทาโรต์', url: 'https://www.facebook.com/share/1BqsEL29qw/' },
    ],
    status_options: ['รอตรวจสลิป', 'รอตรวจคิว', 'กำลังดูดวง', 'กำลังดำเนินการ', 'ส่งคำทำนายแล้ว', 'เสร็จแล้ว'],
    enable_express_queue: true,
    express_queue_fee: 32,
    express_estimated_time: '⚡ ภายใน 12-24 ชั่วโมง',
  },
  categories: [
    {
      id: 'cat-1',
      name: '🔮 ดูดวงตอบคำถาม (ไพ่ทาโรต์)',
      description: 'เปิดไพ่ตอบตรงประเด็น ชัดเจน พร้อมคำแนะนำและทางออกที่ดีที่สุด',
      sort_order: 1,
      product_type: 'fortune',
      packages: [
        {
          id: 'pkg-1',
          category_id: 'cat-1',
          name: 'คำถามทั่วไป',
          description: 'ถามเรื่องทั่วไป 1 ข้อ ตอบกระชับ ชัดเจน พร้อมคำแนะนำ',
          price: 15,
          badge: '15.-',
          is_active: true,
          product_type: 'fortune',
        },
        {
          id: 'pkg-2',
          category_id: 'cat-1',
          name: 'คำถามเจาะจง',
          description: 'ถามเรื่องที่อยากรู้เจาะจง 1 เรื่อง ลึกถึงสาเหตุ แนวโน้ม และแนวทางแก้ไข',
          price: 25,
          badge: '25.-',
          is_active: true,
          product_type: 'fortune',
        },
        {
          id: 'pkg-3',
          category_id: 'cat-1',
          name: 'ลัดคิวแบบเจาะจง',
          description: 'ถามคำถามเจาะจง พร้อมสิทธิ์ลัดคิวพิเศษ (เรทเดียว 32 บาท) ได้รับคำทำนายด่วนภายใน 12-24 ชั่วโมง',
          price: 32,
          badge: '⚡ ลัดคิว 32.-',
          is_active: true,
          product_type: 'fortune',
        },
      ],
    },
    {
      id: 'cat-2',
      name: '📞 ดูดวงแบบโทรสด (Voice Call)',
      description: 'โทรเปิดไพ่คุยสดกับแม่หมอ ปรึกษาได้ทุกเรื่องอย่างเป็นกันเองและสบายใจ',
      sort_order: 2,
      product_type: 'fortune',
      packages: [
        {
          id: 'pkg-4',
          category_id: 'cat-2',
          name: '♡ 15 น݁า݂ที     69 บ݁า݂ท ♡ ⃗',
          description: '♡ 15 น݁า݂ที     69 บ݁า݂ท ♡ ⃗ คุยสด ถาม-ตอบคลายทุกข้อสงสัยอย่างเป็นกันเอง',
          price: 69,
          badge: '69.-',
          is_active: true,
          product_type: 'fortune',
        },
        {
          id: 'pkg-5',
          category_id: 'cat-2',
          name: '♡ 25 น݁า݂ที     89 บ݁า݂ท 𓈒',
          description: '♡ 25 น݁า݂ที     89 บ݁า݂ท 𓈒 ปรึกษาเจาะลึกเรื่องความรัก การงาน การเงิน',
          price: 89,
          badge: '89.-',
          is_active: true,
          product_type: 'fortune',
        },
        {
          id: 'pkg-6',
          category_id: 'cat-2',
          name: '♡ 45 น݁า݂ที     139 บ݁า݂ท',
          description: '♡ 45 น݁า݂ที     139 บ݁า݂ท เคลียร์ทุกเรื่องรอบด้าน ไม่จำกัดจำนวนคำถามในเวลา',
          price: 139,
          badge: '139.-',
          is_active: true,
          product_type: 'fortune',
        },
      ],
    },
  ],
  orders: [],
  queues: [],
  music_tracks: [
    {
      id: 'song-1',
      title: 'Peaceful Apple Breeze',
      artist: 'Cottage Breeze',
      url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
      is_active: true,
    },
    {
      id: 'song-2',
      title: 'Acoustic Morning in Garden',
      artist: 'Sunny Leaf',
      url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=acoustic-guitars-ambient-uplifting-10118.mp3',
      is_active: true,
    },
    {
      id: 'song-3',
      title: 'Autumn Wind & Sweet Apples',
      artist: 'Forest Melodies',
      url: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=cozy-place-chill-background-music-122718.mp3',
      is_active: true,
    },
  ],
  reviews: [
    {
      id: 'rev-1',
      customer_name: 'คุณมิว',
      rating: 5,
      comment: 'ภาพวาดน่ารักมากเลยค่ะ ลายเส้นแอปเปิ้ลละมุนใจมาก ร้านส่งงานไวและพูดจาดีมาก แนะนำเลยค่ะ! 🍎❤️',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'rev-2',
      customer_name: 'คุณพลอย',
      rating: 5,
      comment: 'สั่งกล่องสุ่ม Lucky Apple Box มา เปิดออกมาคือน่ารักทุกชิ้น มีกลิ่นหอมเหมือนแอปเปิ้ลจริง ๆ ประทับใจมากค่ะ',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: 'rev-3',
      customer_name: 'คุณเบนซ์',
      rating: 5,
      comment: 'ระบบร้านและติดตามคิวดูง่ายมาก สั่งซื้อง่าย ได้รับงานตรงตามเวลาเป๊ะ ไว้อุดหนุนอีกแน่นอนครับ',
      created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
  ],
};

export function readLocalDb(): LocalDatabase {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_STORE_DATA, null, 2), 'utf-8');
    return DEFAULT_STORE_DATA;
  }
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  try {
    const parsed = JSON.parse(raw);
    return {
      settings: parsed.settings || DEFAULT_STORE_DATA.settings,
      categories: parsed.categories || DEFAULT_STORE_DATA.categories,
      orders: parsed.orders || [],
      queues: parsed.queues || [],
      music_tracks: parsed.music_tracks || DEFAULT_STORE_DATA.music_tracks,
      reviews: parsed.reviews || DEFAULT_STORE_DATA.reviews,
      admin_password_hash: parsed.admin_password_hash,
      admin_password_salt: parsed.admin_password_salt,
    };
  } catch (err) {
    throw new Error(`Failed to parse local database file: ${err instanceof Error ? err.message : String(err)}`);
  }
}

export function writeLocalDb(data: LocalDatabase): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tempFile = `${DATA_FILE}.${Date.now()}.${Math.random().toString(36).substring(2, 7)}.tmp`;
  try {
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DATA_FILE);
  } catch (err) {
    if (fs.existsSync(tempFile)) {
      try {
        fs.unlinkSync(tempFile);
      } catch {
        // ignore cleanup error
      }
    }
    throw new Error(`Failed to write local database: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// -------------------------------------------------------------
// PUBLIC API METHODS (SINGLE SOURCE OF TRUTH IN EACH MODE)
// -------------------------------------------------------------

export async function getStoreData() {
  if (isNeonConfigured) {
    try {
      const [settings, categories, music_tracks, reviews] = await Promise.all([
        neonGet<StoreSettings>('settings', DEFAULT_STORE_DATA.settings),
        neonGet<Category[]>('categories', DEFAULT_STORE_DATA.categories),
        neonGet<MusicTrack[]>('music_tracks', DEFAULT_STORE_DATA.music_tracks),
        neonGet<Review[]>('reviews', DEFAULT_STORE_DATA.reviews),
      ]);
      return {
        settings: settings || DEFAULT_STORE_DATA.settings,
        categories: categories && categories.length > 0 ? categories : DEFAULT_STORE_DATA.categories,
        music_tracks: music_tracks && music_tracks.length > 0 ? music_tracks : DEFAULT_STORE_DATA.music_tracks,
        reviews: reviews && reviews.length > 0 ? reviews : DEFAULT_STORE_DATA.reviews,
      };
    } catch (err) {
      console.warn('Neon read getStoreData error, falling back:', err);
    }
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    const [settingsRes, catsRes, pkgsRes, musicRes, reviewsRes] = await Promise.all([
      supabaseAdmin.from('store_settings').select('*'),
      supabaseAdmin.from('categories').select('*').order('sort_order', { ascending: true }),
      supabaseAdmin.from('packages').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
      supabaseAdmin.from('music_tracks').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
      supabaseAdmin.from('reviews').select('*').eq('is_visible', true).order('created_at', { ascending: false }),
    ]);

    if (settingsRes.error) throw new Error(`Supabase settings read error: ${settingsRes.error.message}`);
    if (catsRes.error) throw new Error(`Supabase categories read error: ${catsRes.error.message}`);
    if (pkgsRes.error) throw new Error(`Supabase packages read error: ${pkgsRes.error.message}`);
    if (musicRes.error) throw new Error(`Supabase music tracks read error: ${musicRes.error.message}`);
    if (reviewsRes.error) throw new Error(`Supabase reviews read error: ${reviewsRes.error.message}`);

    const settingsMap: Record<string, unknown> = {};
    settingsRes.data?.forEach((row: { key: string; value: unknown }) => {
      settingsMap[row.key] = row.value;
    });

    const categories: Category[] = (catsRes.data || []).map((cat: {
      id: string;
      name: string;
      description?: string;
      sort_order: number;
      product_type?: 'fortune' | 'physical';
    }) => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      sort_order: cat.sort_order,
      product_type: cat.product_type,
      packages: (pkgsRes.data || [])
        .filter((p: { category_id: string }) => p.category_id === cat.id)
        .map((p: {
          id: string;
          category_id: string;
          name: string;
          description: string;
          price: number;
          original_price?: number;
          badge?: string;
          is_active: boolean;
          product_type?: 'fortune' | 'physical';
        }) => ({
          id: p.id,
          category_id: p.category_id,
          name: p.name,
          description: p.description,
          price: Number(p.price),
          original_price: p.original_price ? Number(p.original_price) : undefined,
          badge: p.badge,
          is_active: p.is_active,
          product_type: p.product_type,
        })),
    }));

    return {
      settings: { ...DEFAULT_STORE_DATA.settings, ...settingsMap } as StoreSettings,
      categories: categories.length > 0 ? categories : DEFAULT_STORE_DATA.categories,
      music_tracks: (musicRes.data && musicRes.data.length > 0) ? musicRes.data : DEFAULT_STORE_DATA.music_tracks,
      reviews: (reviewsRes.data && reviewsRes.data.length > 0) ? reviewsRes.data : DEFAULT_STORE_DATA.reviews,
    };
  }

  // Local File Mode: single source of truth
  const local = readLocalDb();
  return {
    settings: local.settings,
    categories: local.categories,
    music_tracks: local.music_tracks,
    reviews: local.reviews,
  };
}

export async function createOrder(data: {
  customer_name: string;
  order_type?: OrderType;
  birth_date?: string;
  birth_time?: string;
  zodiac_sign?: string;
  question?: string;
  shipping_name?: string;
  shipping_phone?: string;
  shipping_address?: string;
  shipping_subdistrict?: string;
  shipping_district?: string;
  shipping_province?: string;
  shipping_postal_code?: string;
  customer_note?: string;
  contact_channel: string;
  contact_value: string;
  items: { id: string; quantity: number }[];
  is_express?: boolean;
}): Promise<Order> {
  // Fetch packages and settings strictly from the active single source of truth
  let allPackages: PackageItem[] = [];
  let expressFeeSetting = 32;

  if (isNeonConfigured) {
    try {
      const [neonCats, neonSettings] = await Promise.all([
        neonGet<Category[]>('categories', DEFAULT_STORE_DATA.categories),
        neonGet<StoreSettings>('settings', DEFAULT_STORE_DATA.settings),
      ]);
      allPackages = (neonCats || []).flatMap((c) => c.packages);
      if (neonSettings?.express_queue_fee !== undefined) {
        expressFeeSetting = Number(neonSettings.express_queue_fee);
      }
    } catch (e) {
      console.warn('Neon package read failed in createOrder, fallback:', e);
      const local = readLocalDb();
      allPackages = local.categories.flatMap((c) => c.packages);
      if (local.settings.express_queue_fee !== undefined) {
        expressFeeSetting = Number(local.settings.express_queue_fee);
      }
    }
  } else if (isSupabaseConfigured && supabaseAdmin) {
    const { data: pkgs, error } = await supabaseAdmin
      .from('packages')
      .select('*')
      .eq('is_active', true);

    if (error) {
      throw new Error(`Failed to retrieve packages from Supabase: ${error.message}`);
    }

    const { data: stSetting } = await supabaseAdmin
      .from('store_settings')
      .select('value')
      .eq('key', 'express_queue_fee')
      .maybeSingle();

    if (stSetting && stSetting.value !== undefined) {
      expressFeeSetting = Number(stSetting.value);
    }

    allPackages = (pkgs || []).map((p: {
      id: string;
      category_id: string;
      name: string;
      description: string;
      price: number;
      original_price?: number;
      badge?: string;
      is_active: boolean;
      product_type?: 'fortune' | 'physical';
    }) => ({
      id: p.id,
      category_id: p.category_id,
      name: p.name,
      description: p.description,
      price: Number(p.price),
      original_price: p.original_price ? Number(p.original_price) : undefined,
      badge: p.badge,
      is_active: p.is_active,
      product_type: p.product_type,
    }));
  } else {
    const local = readLocalDb();
    allPackages = local.categories.flatMap((c) => c.packages);
    if (local.settings.express_queue_fee !== undefined) {
      expressFeeSetting = Number(local.settings.express_queue_fee);
    }
  }

  // Validate items and compute totals strictly from database packages
  const validatedItems: Order['items'] = [];
  let calculatedTotal = 0;

  for (const item of data.items) {
    const pkg = allPackages.find((p) => p.id === item.id);
    if (!pkg) continue;
    const qty = Math.max(1, Math.min(item.quantity || 1, 99));
    validatedItems.push({
      id: pkg.id,
      name: pkg.name,
      price: pkg.price,
      quantity: qty,
      desc: pkg.description,
      product_type: pkg.product_type,
    });
    calculatedTotal += pkg.price * qty;
  }

  if (validatedItems.length === 0) {
    throw new Error('กรุณาเลือกสินค้าหรือแพ็กเกจอย่างน้อย 1 รายการ');
  }

  const hasExpressItem = validatedItems.some(
    (i) => i.id === 'pkg-3' || i.name.includes('ลัดคิว')
  );
  const isExpress = Boolean(data.is_express) || hasExpressItem;

  // Real flat express queue rate is 32 THB ("ลัดคิวมีเรทเดียวเป็นราคา 32 บาทเลย")
  const expressFlatRate = expressFeeSetting || 32;
  let expressFee = 0;

  if (isExpress) {
    if (hasExpressItem) {
      // pkg-3 is already 32 THB in calculatedTotal, no extra fee needed
      expressFee = 0;
    } else {
      // If customer ordered regular fortune questions (15 or 25 THB) and opted for express queue:
      // Express queue has only ONE flat rate: 32 THB
      const fortuneSubtotal = validatedItems
        .filter((i) => i.product_type !== 'physical')
        .reduce((acc, i) => acc + i.price * i.quantity, 0);
      expressFee = Math.max(0, expressFlatRate - fortuneSubtotal);
      calculatedTotal += expressFee;
    }
  }

  // Determine order type based on validated products
  const hasPhysical = validatedItems.some((i) => i.product_type === 'physical');
  const hasFortune = validatedItems.some((i) => i.product_type !== 'physical');
  const detectedOrderType: OrderType =
    hasPhysical && hasFortune ? 'mixed' : hasPhysical ? 'physical' : 'fortune';

  // Validate required fields based on order type
  if (hasPhysical) {
    if (!data.shipping_address && !data.shipping_name) {
      throw new Error('สินค้าจริงต้องระบุข้อมูลจัดส่ง (ชื่อผู้รับและที่อยู่จัดส่ง)');
    }
  }

  const orderNo = generateOrderNo();
  const trackingToken = generateTrackingToken();
  const now = new Date().toISOString();

  const newOrder: Order = {
    id: 'ord-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    order_no: orderNo,
    tracking_token: trackingToken,
    order_type: detectedOrderType,
    customer_name: data.customer_name.trim(),
    birth_date: hasFortune ? data.birth_date?.trim() || undefined : undefined,
    birth_time: hasFortune ? data.birth_time?.trim() || undefined : undefined,
    zodiac_sign: hasFortune ? data.zodiac_sign?.trim() || undefined : undefined,
    question: hasFortune ? data.question?.trim() || undefined : undefined,
    shipping_name: hasPhysical ? data.shipping_name?.trim() || undefined : undefined,
    shipping_phone: hasPhysical ? data.shipping_phone?.trim() || undefined : undefined,
    shipping_address: hasPhysical ? data.shipping_address?.trim() || undefined : undefined,
    shipping_subdistrict: hasPhysical ? data.shipping_subdistrict?.trim() || undefined : undefined,
    shipping_district: hasPhysical ? data.shipping_district?.trim() || undefined : undefined,
    shipping_province: hasPhysical ? data.shipping_province?.trim() || undefined : undefined,
    shipping_postal_code: hasPhysical ? data.shipping_postal_code?.trim() || undefined : undefined,
    customer_note: data.customer_note?.trim() || undefined,
    contact_channel: data.contact_channel,
    contact_value: data.contact_value.trim(),
    items: validatedItems,
    total_amount: calculatedTotal,
    is_express: isExpress,
    express_fee: isExpress ? expressFee : undefined,
    status: 'pending_slip',
    created_at: now,
    updated_at: now,
  };

  if (isNeonConfigured) {
    try {
      const orders = await neonGet<Order[]>('orders', []);
      orders.unshift(newOrder);
      await neonSet('orders', orders);
    } catch (err) {
      console.error('Failed to save order to Neon:', err);
    }
    try {
      const local = readLocalDb();
      local.orders.unshift(newOrder);
      writeLocalDb(local);
    } catch {}
    return newOrder;
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    const { data: inserted, error } = await supabaseAdmin
      .from('orders')
      .insert({
        order_no: newOrder.order_no,
        tracking_token: newOrder.tracking_token,
        order_type: newOrder.order_type,
        customer_name: newOrder.customer_name,
        birth_date: newOrder.birth_date || null,
        birth_time: newOrder.birth_time || null,
        zodiac_sign: newOrder.zodiac_sign || null,
        question: newOrder.question || null,
        shipping_name: newOrder.shipping_name || null,
        shipping_phone: newOrder.shipping_phone || null,
        shipping_address: newOrder.shipping_address || null,
        shipping_subdistrict: newOrder.shipping_subdistrict || null,
        shipping_district: newOrder.shipping_district || null,
        shipping_province: newOrder.shipping_province || null,
        shipping_postal_code: newOrder.shipping_postal_code || null,
        customer_note: newOrder.customer_note || null,
        contact_channel: newOrder.contact_channel,
        contact_value: newOrder.contact_value,
        items: newOrder.items,
        total_amount: newOrder.total_amount,
        is_express: newOrder.is_express || false,
        express_fee: newOrder.express_fee || 0,
        status: newOrder.status,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save order to Supabase: ${error.message}`);
    }
    if (inserted) {
      newOrder.id = inserted.id;
    }
    return newOrder;
  }

  // Local File Mode
  const local = readLocalDb();
  local.orders.unshift(newOrder);
  writeLocalDb(local);
  return newOrder;
}

export async function uploadSlip(orderNo: string, slipUrl: string, filename?: string): Promise<Order> {
  const now = new Date().toISOString();

  if (isNeonConfigured) {
    const orders = await neonGet<Order[]>('orders', []);
    const order = orders.find((o) => o.order_no === orderNo || o.id === orderNo);
    if (!order) {
      throw new Error('ไม่พบข้อมูลคำสั่งซื้อ');
    }
    order.slip_url = slipUrl;
    order.slip_filename = filename;
    order.status = 'pending_verification';
    order.updated_at = now;
    await neonSet('orders', orders);

    try {
      const local = readLocalDb();
      const locOrder = local.orders.find((o) => o.order_no === orderNo || o.id === orderNo);
      if (locOrder) {
        locOrder.slip_url = slipUrl;
        locOrder.slip_filename = filename;
        locOrder.status = 'pending_verification';
        locOrder.updated_at = now;
        writeLocalDb(local);
      }
    } catch {}

    return order;
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    const { data: existing, error: findErr } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('order_no', orderNo)
      .single();

    if (findErr || !existing) {
      throw new Error('ไม่พบข้อมูลคำสั่งซื้อ');
    }

    const { data: updated, error: updateErr } = await supabaseAdmin
      .from('orders')
      .update({
        slip_url: slipUrl,
        slip_filename: filename,
        status: 'pending_verification',
        updated_at: now,
      })
      .eq('order_no', orderNo)
      .select()
      .single();

    if (updateErr) {
      throw new Error(`Failed to update slip in Supabase: ${updateErr.message}`);
    }
    return updated as Order;
  }

  // Local File Mode
  const local = readLocalDb();
  const order = local.orders.find((o) => o.order_no === orderNo || o.id === orderNo);
  if (!order) {
    throw new Error('ไม่พบข้อมูลคำสั่งซื้อ');
  }

  order.slip_url = slipUrl;
  order.slip_filename = filename;
  order.status = 'pending_verification';
  order.updated_at = now;

  writeLocalDb(local);
  return order;
}

export async function getOrder(orderNoOrId: string, trackingToken?: string): Promise<Order | null> {
  if (isNeonConfigured) {
    const orders = await neonGet<Order[]>('orders', []);
    const order = orders.find(
      (o) =>
        (o.order_no === orderNoOrId || o.id === orderNoOrId) &&
        (!trackingToken || o.tracking_token === trackingToken)
    );
    if (order) return order;
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    let query = supabaseAdmin
      .from('orders')
      .select('*')
      .or(`order_no.eq.${orderNoOrId},id.eq.${orderNoOrId}`);

    if (trackingToken) {
      query = query.eq('tracking_token', trackingToken);
    }

    const { data, error } = await query.maybeSingle();
    if (error) {
      throw new Error(`Failed to fetch order from Supabase: ${error.message}`);
    }
    return (data as Order) || null;
  }

  const local = readLocalDb();
  const order = local.orders.find(
    (o) =>
      (o.order_no === orderNoOrId || o.id === orderNoOrId) &&
      (!trackingToken || o.tracking_token === trackingToken)
  );
  return order || null;
}

export async function getAllOrders(): Promise<Order[]> {
  if (isNeonConfigured) {
    const orders = await neonGet<Order[]>('orders', []);
    return orders;
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch orders from Supabase: ${error.message}`);
    }
    return (data as Order[]) || [];
  }

  const local = readLocalDb();
  return local.orders;
}

export async function getAllQueues(): Promise<QueueItem[]> {
  if (isNeonConfigured) {
    const queues = await neonGet<QueueItem[]>('queues', []);
    return queues.sort((a, b) => a.queue_no - b.queue_no);
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('queues')
      .select('*')
      .order('queue_no', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch queues from Supabase: ${error.message}`);
    }
    return (data as QueueItem[]) || [];
  }

  const local = readLocalDb();
  return local.queues.sort((a, b) => a.queue_no - b.queue_no);
}

export async function getQueueByOrder(orderNo: string): Promise<QueueItem | null> {
  if (isNeonConfigured) {
    const queues = await neonGet<QueueItem[]>('queues', []);
    const q = queues.find((item) => item.order_no === orderNo);
    return q || null;
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('queues')
      .select('*')
      .eq('order_no', orderNo)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch queue from Supabase: ${error.message}`);
    }
    return (data as QueueItem) || null;
  }

  const local = readLocalDb();
  const q = local.queues.find((item) => item.order_no === orderNo);
  return q || null;
}

/**
 * Confirm Payment & Automatically Add to Queue without duplication
 */
export async function confirmOrderPayment(orderIdOrNo: string) {
  const now = new Date().toISOString();

  if (isNeonConfigured) {
    const [orders, queues, storeInfo] = await Promise.all([
      neonGet<Order[]>('orders', []),
      neonGet<QueueItem[]>('queues', []),
      getStoreData(),
    ]);

    const order = orders.find((o) => o.id === orderIdOrNo || o.order_no === orderIdOrNo);
    if (!order) {
      throw new Error('ไม่พบคำสั่งซื้อ');
    }

    order.status = 'confirmed';
    order.updated_at = now;

    let queueItem = queues.find((q) => q.order_no === order.order_no);
    if (!queueItem) {
      const nextQueueNo =
        (queues.length > 0 ? Math.max(...queues.map((q) => q.queue_no)) : 0) + 1;

      const isExpress = Boolean(order.is_express);
      const defaultEstimated = isExpress
        ? (storeInfo.settings.express_estimated_time || '⚡ ภายใน 12-24 ชั่วโมง')
        : '1-2 วันทำการ';
      const defaultNote = isExpress
        ? '⚡ รับออเดอร์คิวด่วนพิเศษ ลัดคิวตามลำดับเร่งด่วนค่ะ'
        : 'รับออเดอร์เรียบร้อย รอคิวจัดทำตามลำดับค่ะ';

      const itemsSummary = (order.items || []).map((i) => `${i.name} x${i.quantity}`).join(', ');

      queueItem = {
        id: 'q-' + Date.now(),
        queue_no: nextQueueNo,
        order_id: order.id,
        order_no: order.order_no,
        customer_name: order.customer_name,
        items_summary: isExpress ? `⚡ [ลัดคิว] ${itemsSummary}` : itemsSummary,
        contact_info: `${order.contact_channel}: ${order.contact_value}`,
        status: 'รอตรวจคิว',
        is_express: isExpress,
        estimated_time: defaultEstimated,
        shop_note: defaultNote,
        is_manual: false,
        created_at: now,
        updated_at: now,
      };

      queues.push(queueItem);
      order.queue_id = queueItem.id;
    }

    await Promise.all([neonSet('orders', orders), neonSet('queues', queues)]);

    // Mirror to local DB
    try {
      const local = readLocalDb();
      const locOrder = local.orders.find((o) => o.id === orderIdOrNo || o.order_no === orderIdOrNo);
      if (locOrder) {
        locOrder.status = 'confirmed';
        locOrder.updated_at = now;
        locOrder.queue_id = queueItem.id;
      }
      if (!local.queues.some((q) => q.order_no === order.order_no)) {
        local.queues.push(queueItem);
      }
      writeLocalDb(local);
    } catch {}

    return { order, queue: queueItem };
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    // 1. Fetch order
    const { data: order, error: orderErr } = await supabaseAdmin
      .from('orders')
      .select('*')
      .or(`id.eq.${orderIdOrNo},order_no.eq.${orderIdOrNo}`)
      .single();

    if (orderErr || !order) {
      throw new Error('ไม่พบคำสั่งซื้อ');
    }

    // 2. Update order status
    const { error: updErr } = await supabaseAdmin
      .from('orders')
      .update({ status: 'confirmed', updated_at: now })
      .eq('id', order.id);

    if (updErr) {
      throw new Error(`Failed to confirm order in Supabase: ${updErr.message}`);
    }
    order.status = 'confirmed';

    // 3. Check existing queue for this order
    const { data: existingQ } = await supabaseAdmin
      .from('queues')
      .select('*')
      .eq('order_no', order.order_no)
      .maybeSingle();

    if (existingQ) {
      return { order: order as Order, queue: existingQ as QueueItem };
    }

    // 4. Calculate next queue_no
    const { data: allQ } = await supabaseAdmin
      .from('queues')
      .select('queue_no')
      .order('queue_no', { ascending: false })
      .limit(1);

    const nextQueueNo = (allQ && allQ.length > 0 ? allQ[0].queue_no : 0) + 1;
    const isExpress = Boolean(order.is_express);
    const storeInfo = await getStoreData();
    const defaultEstimated = isExpress
      ? (storeInfo.settings.express_estimated_time || '⚡ ภายใน 12-24 ชั่วโมง')
      : '1-2 วันทำการ';
    const defaultNote = isExpress
      ? '⚡ รับออเดอร์คิวด่วนพิเศษ ลัดคิวตามลำดับเร่งด่วนค่ะ'
      : 'รับออเดอร์เรียบร้อย รอคิวจัดทำตามลำดับค่ะ';

    const itemsSummary = (order.items as Order['items'])
      .map((i) => `${i.name} x${i.quantity}`)
      .join(', ');

    const newQueuePayload = {
      queue_no: nextQueueNo,
      order_id: order.id,
      order_no: order.order_no,
      customer_name: order.customer_name,
      items_summary: isExpress ? `⚡ [ลัดคิว] ${itemsSummary}` : itemsSummary,
      contact_info: `${order.contact_channel}: ${order.contact_value}`,
      status: 'รอตรวจคิว',
      is_express: isExpress,
      estimated_time: defaultEstimated,
      shop_note: defaultNote,
      is_manual: false,
      created_at: now,
      updated_at: now,
    };

    const { data: insertedQ, error: qErr } = await supabaseAdmin
      .from('queues')
      .insert(newQueuePayload)
      .select()
      .single();

    if (qErr) {
      throw new Error(`Failed to insert queue in Supabase: ${qErr.message}`);
    }

    await supabaseAdmin
      .from('orders')
      .update({ queue_id: insertedQ.id })
      .eq('id', order.id);

    return { order: order as Order, queue: insertedQ as QueueItem };
  }

  // Local File Mode
  const local = readLocalDb();
  const order = local.orders.find((o) => o.id === orderIdOrNo || o.order_no === orderIdOrNo);
  if (!order) {
    throw new Error('ไม่พบคำสั่งซื้อ');
  }

  order.status = 'confirmed';
  order.updated_at = now;

  let queueItem = local.queues.find((q) => q.order_no === order.order_no);
  if (!queueItem) {
    const nextQueueNo =
      (local.queues.length > 0 ? Math.max(...local.queues.map((q) => q.queue_no)) : 0) + 1;

    const isExpress = Boolean(order.is_express);
    const defaultEstimated = isExpress
      ? (local.settings.express_estimated_time || '⚡ ภายใน 12-24 ชั่วโมง')
      : '1-2 วันทำการ';
    const defaultNote = isExpress
      ? '⚡ รับออเดอร์คิวด่วนพิเศษ ลัดคิวตามลำดับเร่งด่วนค่ะ'
      : 'รับออเดอร์เรียบร้อย รอคิวจัดทำตามลำดับค่ะ';

    const itemsSummary = order.items.map((i) => `${i.name} x${i.quantity}`).join(', ');

    queueItem = {
      id: 'q-' + Date.now(),
      queue_no: nextQueueNo,
      order_id: order.id,
      order_no: order.order_no,
      customer_name: order.customer_name,
      items_summary: isExpress ? `⚡ [ลัดคิว] ${itemsSummary}` : itemsSummary,
      contact_info: `${order.contact_channel}: ${order.contact_value}`,
      status: 'รอตรวจคิว',
      is_express: isExpress,
      estimated_time: defaultEstimated,
      shop_note: defaultNote,
      is_manual: false,
      created_at: now,
      updated_at: now,
    };

    local.queues.push(queueItem);
    order.queue_id = queueItem.id;
  }

  writeLocalDb(local);
  return { order, queue: queueItem };
}

export async function updateQueueStatus(
  queueId: string,
  status: QueueStatus,
  estimatedTime?: string,
  shopNote?: string,
  isExpress?: boolean
): Promise<QueueItem> {
  const now = new Date().toISOString();

  if (isNeonConfigured) {
    const queues = await neonGet<QueueItem[]>('queues', []);
    const queue = queues.find((q) => q.id === queueId);
    if (!queue) {
      throw new Error('ไม่พบคิว');
    }
    queue.status = status;
    if (estimatedTime !== undefined) queue.estimated_time = estimatedTime;
    if (shopNote !== undefined) queue.shop_note = shopNote;
    if (isExpress !== undefined) queue.is_express = isExpress;
    queue.updated_at = now;

    await neonSet('queues', queues);

    try {
      const local = readLocalDb();
      const lq = local.queues.find((q) => q.id === queueId);
      if (lq) {
        lq.status = status;
        if (estimatedTime !== undefined) lq.estimated_time = estimatedTime;
        if (shopNote !== undefined) lq.shop_note = shopNote;
        if (isExpress !== undefined) lq.is_express = isExpress;
        lq.updated_at = now;
        writeLocalDb(local);
      }
    } catch {}

    return queue;
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    const updatePayload: Record<string, unknown> = {
      status,
      updated_at: now,
    };
    if (estimatedTime !== undefined) updatePayload.estimated_time = estimatedTime;
    if (shopNote !== undefined) updatePayload.shop_note = shopNote;
    if (isExpress !== undefined) updatePayload.is_express = isExpress;

    const { data, error } = await supabaseAdmin
      .from('queues')
      .update(updatePayload)
      .eq('id', queueId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update queue in Supabase: ${error.message}`);
    }
    return data as QueueItem;
  }

  const local = readLocalDb();
  const queue = local.queues.find((q) => q.id === queueId);
  if (!queue) {
    throw new Error('ไม่พบคิว');
  }

  queue.status = status;
  if (estimatedTime !== undefined) queue.estimated_time = estimatedTime;
  if (shopNote !== undefined) queue.shop_note = shopNote;
  if (isExpress !== undefined) queue.is_express = isExpress;
  queue.updated_at = now;

  writeLocalDb(local);
  return queue;
}

export async function addManualQueue(data: {
  customer_name: string;
  items_summary: string;
  contact_info?: string;
  estimated_time?: string;
  shop_note?: string;
  is_express?: boolean;
}): Promise<QueueItem> {
  const now = new Date().toISOString();

  if (isNeonConfigured) {
    const queues = await neonGet<QueueItem[]>('queues', []);
    const nextQueueNo =
      (queues.length > 0 ? Math.max(...queues.map((q) => q.queue_no)) : 0) + 1;

    const newQueue: QueueItem = {
      id: 'q-man-' + Date.now(),
      queue_no: nextQueueNo,
      order_no: 'MAN-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
      customer_name: data.customer_name,
      items_summary: data.is_express ? `⚡ [ลัดคิว] ${data.items_summary}` : data.items_summary,
      contact_info: data.contact_info || '-',
      status: 'รอตรวจคิว',
      is_express: Boolean(data.is_express),
      estimated_time: data.estimated_time || (data.is_express ? '⚡ ภายใน 12-24 ชั่วโมง' : '1-2 วันทำการ'),
      shop_note: data.shop_note || (data.is_express ? '⚡ คิวด่วนพิเศษ เพิ่มโดยร้านค้า' : 'คิวเพิ่มด้วยตนเองโดยร้านค้า'),
      is_manual: true,
      created_at: now,
      updated_at: now,
    };

    queues.push(newQueue);
    await neonSet('queues', queues);

    try {
      const local = readLocalDb();
      local.queues.push(newQueue);
      writeLocalDb(local);
    } catch {}

    return newQueue;
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    const { data: allQ } = await supabaseAdmin
      .from('queues')
      .select('queue_no')
      .order('queue_no', { ascending: false })
      .limit(1);

    const nextQueueNo = (allQ && allQ.length > 0 ? allQ[0].queue_no : 0) + 1;
    const newQueuePayload = {
      queue_no: nextQueueNo,
      order_no: 'MAN-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
      customer_name: data.customer_name,
      items_summary: data.is_express ? `⚡ [ลัดคิว] ${data.items_summary}` : data.items_summary,
      contact_info: data.contact_info || '-',
      status: 'รอตรวจคิว',
      is_express: Boolean(data.is_express),
      estimated_time: data.estimated_time || (data.is_express ? '⚡ ภายใน 12-24 ชั่วโมง' : '1-2 วันทำการ'),
      shop_note: data.shop_note || (data.is_express ? '⚡ คิวด่วนพิเศษ เพิ่มโดยร้านค้า' : 'คิวเพิ่มด้วยตนเองโดยร้านค้า'),
      is_manual: true,
      created_at: now,
      updated_at: now,
    };

    const { data: inserted, error } = await supabaseAdmin
      .from('queues')
      .insert(newQueuePayload)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add manual queue to Supabase: ${error.message}`);
    }
    return inserted as QueueItem;
  }

  const local = readLocalDb();
  const nextQueueNo =
    (local.queues.length > 0 ? Math.max(...local.queues.map((q) => q.queue_no)) : 0) + 1;

  const newQueue: QueueItem = {
    id: 'q-man-' + Date.now(),
    queue_no: nextQueueNo,
    order_no: 'MAN-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
    customer_name: data.customer_name,
    items_summary: data.is_express ? `⚡ [ลัดคิว] ${data.items_summary}` : data.items_summary,
    contact_info: data.contact_info || '-',
    status: 'รอตรวจคิว',
    is_express: Boolean(data.is_express),
    estimated_time: data.estimated_time || (data.is_express ? '⚡ ภายใน 12-24 ชั่วโมง' : '1-2 วันทำการ'),
    shop_note: data.shop_note || (data.is_express ? '⚡ คิวด่วนพิเศษ เพิ่มโดยร้านค้า' : 'คิวเพิ่มด้วยตนเองโดยร้านค้า'),
    is_manual: true,
    created_at: now,
    updated_at: now,
  };

  local.queues.push(newQueue);
  writeLocalDb(local);
  return newQueue;
}

export async function deleteQueue(queueId: string): Promise<boolean> {
  if (isNeonConfigured) {
    let queues = await neonGet<QueueItem[]>('queues', []);
    queues = queues.filter((q) => q.id !== queueId);
    await neonSet('queues', queues);

    try {
      const local = readLocalDb();
      local.queues = local.queues.filter((q) => q.id !== queueId);
      writeLocalDb(local);
    } catch {}

    return true;
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    const { error } = await supabaseAdmin.from('queues').delete().eq('id', queueId);
    if (error) {
      throw new Error(`Failed to delete queue in Supabase: ${error.message}`);
    }
    return true;
  }

  const local = readLocalDb();
  local.queues = local.queues.filter((q) => q.id !== queueId);
  writeLocalDb(local);
  return true;
}

export async function saveCategories(categories: Category[]): Promise<Category[]> {
  if (isNeonConfigured) {
    await neonSet('categories', categories);
    try {
      const local = readLocalDb();
      local.categories = categories;
      writeLocalDb(local);
    } catch {}
    return categories;
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    for (const cat of categories) {
      const { error: catErr } = await supabaseAdmin
        .from('categories')
        .upsert({
          id: cat.id,
          name: cat.name,
          description: cat.description,
          sort_order: cat.sort_order,
          product_type: cat.product_type,
        });

      if (catErr) {
        throw new Error(`Failed to save category to Supabase: ${catErr.message}`);
      }

      for (const pkg of cat.packages) {
        const { error: pkgErr } = await supabaseAdmin
          .from('packages')
          .upsert({
            id: pkg.id,
            category_id: cat.id,
            name: pkg.name,
            description: pkg.description,
            price: pkg.price,
            original_price: pkg.original_price,
            badge: pkg.badge,
            is_active: pkg.is_active,
            product_type: pkg.product_type,
          });

        if (pkgErr) {
          throw new Error(`Failed to save package to Supabase: ${pkgErr.message}`);
        }
      }
    }
    return categories;
  }

  const local = readLocalDb();
  local.categories = categories;
  writeLocalDb(local);
  return categories;
}

export async function saveStoreSettings(settings: StoreSettings): Promise<StoreSettings> {
  if (isNeonConfigured) {
    const current = await neonGet<StoreSettings>('settings', DEFAULT_STORE_DATA.settings);
    const updated = { ...current, ...settings };
    await neonSet('settings', updated);
    try {
      const local = readLocalDb();
      local.settings = { ...local.settings, ...settings };
      writeLocalDb(local);
    } catch {}
    return updated;
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    for (const [key, value] of Object.entries(settings)) {
      const { error } = await supabaseAdmin
        .from('store_settings')
        .upsert({ key, value, updated_at: new Date().toISOString() });

      if (error) {
        throw new Error(`Failed to save settings to Supabase: ${error.message}`);
      }
    }
    return settings;
  }

  const local = readLocalDb();
  local.settings = { ...local.settings, ...settings };
  writeLocalDb(local);
  return local.settings;
}

export async function saveMusicTracks(tracks: MusicTrack[]): Promise<MusicTrack[]> {
  if (isNeonConfigured) {
    await neonSet('music_tracks', tracks);
    try {
      const local = readLocalDb();
      local.music_tracks = tracks;
      writeLocalDb(local);
    } catch {}
    return tracks;
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    for (const track of tracks) {
      const { error } = await supabaseAdmin
        .from('music_tracks')
        .upsert({
          id: track.id,
          title: track.title,
          artist: track.artist,
          url: track.url,
          is_active: track.is_active,
        });

      if (error) {
        throw new Error(`Failed to save music track to Supabase: ${error.message}`);
      }
    }
    return tracks;
  }

  const local = readLocalDb();
  local.music_tracks = tracks;
  writeLocalDb(local);
  return tracks;
}

export async function addReview(review: { customer_name: string; rating: number; comment: string }): Promise<Review> {
  const now = new Date().toISOString();

  if (isNeonConfigured) {
    const reviews = await neonGet<Review[]>('reviews', DEFAULT_STORE_DATA.reviews);
    const newRev: Review = {
      id: 'rev-' + Date.now(),
      customer_name: review.customer_name,
      rating: review.rating,
      comment: review.comment,
      created_at: now,
    };
    reviews.unshift(newRev);
    await neonSet('reviews', reviews);
    try {
      const local = readLocalDb();
      local.reviews.unshift(newRev);
      writeLocalDb(local);
    } catch {}
    return newRev;
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .insert({
        customer_name: review.customer_name,
        rating: review.rating,
        comment: review.comment,
        is_visible: true,
        created_at: now,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save review to Supabase: ${error.message}`);
    }
    return data as Review;
  }

  const local = readLocalDb();
  const newRev: Review = {
    id: 'rev-' + Date.now(),
    customer_name: review.customer_name,
    rating: review.rating,
    comment: review.comment,
    created_at: now,
  };
  local.reviews.unshift(newRev);
  writeLocalDb(local);
  return newRev;
}
