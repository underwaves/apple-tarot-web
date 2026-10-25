export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  desc?: string;
  product_type?: 'fortune' | 'physical';
}

export type OrderStatus =
  | 'pending_slip'
  | 'pending_verification'
  | 'confirmed'
  | 'cancelled';

export type OrderType = 'fortune' | 'physical' | 'mixed';

export interface Order {
  id: string;
  order_no: string;
  tracking_token: string;
  order_type?: OrderType;
  customer_name: string;
  // Fortune fields
  birth_date?: string;
  birth_time?: string;
  zodiac_sign?: string;
  question?: string;
  // Physical shipping fields
  shipping_name?: string;
  shipping_phone?: string;
  shipping_address?: string;
  shipping_subdistrict?: string;
  shipping_district?: string;
  shipping_province?: string;
  shipping_postal_code?: string;
  customer_note?: string;
  contact_channel: 'LINE' | 'Instagram' | 'Facebook' | 'Phone' | string;
  contact_value: string;
  items: OrderItem[];
  total_amount: number;
  is_express?: boolean;
  express_fee?: number;
  slip_url?: string;
  slip_filename?: string;
  status: OrderStatus;
  queue_id?: string;
  created_at: string;
  updated_at: string;
}

export type QueueStatus =
  | 'รอตรวจสลิป'
  | 'รอตรวจคิว'
  | 'กำลังดูดวง'
  | 'กำลังดำเนินการ'
  | 'ส่งคำทำนายแล้ว'
  | 'เสร็จแล้ว'
  | 'ยกเลิก';

export interface QueueItem {
  id: string;
  queue_no: number;
  order_id?: string;
  order_no: string;
  customer_name: string;
  items_summary: string;
  contact_info: string;
  status: QueueStatus;
  is_express?: boolean;
  estimated_time?: string;
  shop_note?: string;
  is_manual?: boolean;
  created_at: string;
  updated_at: string;
}

export interface PublicQueueItem {
  id: string;
  queue_no: number;
  customer_name: string;
  status: QueueStatus;
  is_express?: boolean;
  estimated_time?: string;
}

export interface PackageItem {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  badge?: string;
  is_active: boolean;
  product_type?: 'fortune' | 'physical';
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  sort_order: number;
  packages: PackageItem[];
  product_type?: 'fortune' | 'physical';
}

export interface StoreContact {
  type: string;
  name: string;
  url: string;
}

export interface StoreSettings {
  shop_name: string;
  shop_title: string;
  shop_subtitle: string;
  banner_url: string;
  avatar_url: string;
  promptpay_id: string;
  account_name: string;
  bank_name: string;
  bank_account_no?: string;
  truemoney_phone?: string;
  qr_image_url?: string;
  contacts: { label: string; url: string }[];
  socials: StoreContact[];
  status_options: string[];
  enable_express_queue?: boolean;
  express_queue_fee?: number;
  express_estimated_time?: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  url: string;
  is_active: boolean;
}

export interface Review {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}
