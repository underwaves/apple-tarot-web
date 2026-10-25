-- Supabase Schema for Apple Orchard Shop (ร้านค้าธีมสวนแอปเปิ้ล)
-- Run this in your Supabase SQL Editor

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Store Settings Table
CREATE TABLE IF NOT EXISTS store_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  product_type TEXT DEFAULT 'fortune', -- 'fortune' | 'physical'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Packages Table
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  badge TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  product_type TEXT DEFAULT 'fortune', -- 'fortune' | 'physical'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Orders Table (With Strict Privacy & Support for Physical/Fortune Products)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_no TEXT NOT NULL UNIQUE,
  tracking_token TEXT NOT NULL UNIQUE,
  order_type TEXT NOT NULL DEFAULT 'fortune', -- 'fortune' | 'physical' | 'mixed'
  customer_name TEXT NOT NULL,
  
  -- Fortune Telling Specific Fields
  birth_date TEXT,
  birth_time TEXT,
  zodiac_sign TEXT,
  question TEXT,

  -- Physical Shipping Specific Fields
  shipping_name TEXT,
  shipping_phone TEXT,
  shipping_address TEXT,
  shipping_subdistrict TEXT,
  shipping_district TEXT,
  shipping_province TEXT,
  shipping_postal_code TEXT,

  customer_note TEXT,
  contact_channel TEXT NOT NULL,
  contact_value TEXT NOT NULL,
  items JSONB NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  slip_url TEXT,
  slip_filename TEXT,
  status TEXT NOT NULL DEFAULT 'pending_slip', -- pending_slip, pending_verification, confirmed, cancelled
  queue_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_tracking_token ON orders(tracking_token);
CREATE INDEX IF NOT EXISTS idx_orders_order_no ON orders(order_no);

-- 6. Queues Table
CREATE TABLE IF NOT EXISTS queues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  queue_no INTEGER NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  order_no TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  items_summary TEXT NOT NULL,
  contact_info TEXT,
  status TEXT NOT NULL DEFAULT 'รอตรวจคิว',
  estimated_time TEXT,
  shop_note TEXT,
  is_manual BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_queues_order_no ON queues(order_no);

-- 7. Music Tracks Table
CREATE TABLE IF NOT EXISTS music_tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist TEXT,
  url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Customer Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  comment TEXT NOT NULL,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Storage Buckets Setup
INSERT INTO storage.buckets (id, name, public) VALUES ('slips', 'slips', false) ON CONFLICT (id) DO UPDATE SET public = false;
INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true) ON CONFLICT (id) DO UPDATE SET public = true;

-- 10. Enable Row Level Security (RLS) on all tables
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE queues ENABLE ROW LEVEL SECURITY;
ALTER TABLE music_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------

-- Public Read for Catalog & Settings
CREATE POLICY "Allow public read store_settings" ON store_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read packages" ON packages FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read music_tracks" ON music_tracks FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read reviews" ON reviews FOR SELECT USING (is_visible = true);
CREATE POLICY "Allow public insert reviews" ON reviews FOR INSERT WITH CHECK (true);

-- ORDERS TABLE SECURITY:
-- Public can create an order
CREATE POLICY "Allow public insert orders" ON orders FOR INSERT WITH CHECK (true);

-- Public CANNOT read all orders! Public can ONLY read their own order via tracking_token header
CREATE POLICY "Allow public track own order with unguessable token" ON orders
  FOR SELECT
  USING (
    tracking_token IS NOT NULL
    AND tracking_token = coalesce(current_setting('request.headers', true)::json->>'x-tracking-token', '')
  );

-- Slips update permitted ONLY when matching tracking_token
CREATE POLICY "Allow public upload slip with tracking_token" ON orders
  FOR UPDATE
  USING (
    tracking_token IS NOT NULL
    AND tracking_token = coalesce(current_setting('request.headers', true)::json->>'x-tracking-token', '')
  )
  WITH CHECK (
    tracking_token IS NOT NULL
    AND tracking_token = coalesce(current_setting('request.headers', true)::json->>'x-tracking-token', '')
  );

-- QUEUES TABLE SECURITY:
-- Public can track their own queue item only if they possess the order's unguessable tracking token
CREATE POLICY "Allow public track own queue with unguessable token" ON queues
  FOR SELECT
  USING (
    order_no IN (
      SELECT o.order_no FROM orders o
      WHERE o.tracking_token = coalesce(current_setting('request.headers', true)::json->>'x-tracking-token', '')
    )
  );

-- SERVICE ROLE & AUTHENTICATED ADMIN FULL ACCESS
CREATE POLICY "Allow service_role full store_settings" ON store_settings FOR ALL TO service_role USING (true);
CREATE POLICY "Allow service_role full categories" ON categories FOR ALL TO service_role USING (true);
CREATE POLICY "Allow service_role full packages" ON packages FOR ALL TO service_role USING (true);
CREATE POLICY "Allow service_role full orders" ON orders FOR ALL TO service_role USING (true);
CREATE POLICY "Allow service_role full queues" ON queues FOR ALL TO service_role USING (true);
CREATE POLICY "Allow service_role full music_tracks" ON music_tracks FOR ALL TO service_role USING (true);
CREATE POLICY "Allow service_role full reviews" ON reviews FOR ALL TO service_role USING (true);
