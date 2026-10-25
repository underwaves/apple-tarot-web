-- Seed Data for Apple Orchard Shop (Auralune)
-- รันชุดนี้ใน Supabase SQL Editor เพื่อปรับชนิด ID ให้ยืดหยุ่น และใส่ข้อมูลสินค้าเริ่มต้น

-- 1. ปรับชนิด ID ให้รองรับทั้ง String ID (cat-1, pkg-1) และ UUID
ALTER TABLE packages DROP CONSTRAINT IF EXISTS packages_category_id_fkey;
ALTER TABLE queues DROP CONSTRAINT IF EXISTS queues_order_id_fkey;

ALTER TABLE categories ALTER COLUMN id TYPE TEXT;
ALTER TABLE packages ALTER COLUMN id TYPE TEXT;
ALTER TABLE packages ALTER COLUMN category_id TYPE TEXT;
ALTER TABLE orders ALTER COLUMN id TYPE TEXT;
ALTER TABLE orders ALTER COLUMN queue_id TYPE TEXT;
ALTER TABLE queues ALTER COLUMN id TYPE TEXT;
ALTER TABLE queues ALTER COLUMN order_id TYPE TEXT;
ALTER TABLE music_tracks ALTER COLUMN id TYPE TEXT;
ALTER TABLE reviews ALTER COLUMN id TYPE TEXT;

ALTER TABLE packages ADD CONSTRAINT packages_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE;

-- 2. เพิ่มหมวดหมู่สินค้าเริ่มต้น
INSERT INTO categories (id, name, description, sort_order, product_type) VALUES
('cat-1', '🔮 ดูดวงตอบคำถาม (ไพ่ทาโรต์)', 'เปิดไพ่ตอบตรงประเด็น ชัดเจน พร้อมคำแนะนำและทางออกที่ดีที่สุด', 1, 'fortune'),
('cat-2', '📞 ดูดวงแบบโทรสด (Voice Call)', 'โทรเปิดไพ่คุยสดกับแม่หมอ ปรึกษาได้ทุกเรื่องอย่างเป็นกันเองและสบายใจ', 2, 'fortune'),
('cat-3', '🍎 สินค้ามงคลและของที่ระลึก (Physical Products)', 'สินค้าจัดส่งถึงบ้าน ทั้งเทียนหอมอโรมา กล่องสุ่ม และเครื่องรางเสริมดวง', 3, 'physical')
ON CONFLICT (id) DO NOTHING;

-- 3. เพิ่มแพ็กเกจสินค้าเริ่มต้น
INSERT INTO packages (id, category_id, name, description, price, badge, is_active, sort_order, product_type) VALUES
('pkg-1', 'cat-1', 'คำถามทั่วไป', 'ถามเรื่องทั่วไป 1 ข้อ ตอบกระชับ ชัดเจน พร้อมคำแนะนำ', 15, '15.-', true, 1, 'fortune'),
('pkg-2', 'cat-1', 'คำถามเจาะจง', 'ถามเรื่องที่อยากรู้เจาะจง 1 เรื่อง ลึกถึงสาเหตุ แนวโน้ม และแนวทางแก้ไข', 25, '25.-', true, 2, 'fortune'),
('pkg-3', 'cat-1', 'ลัดคิวแบบเจาะจง', 'ถามคำถามเจาะจง พร้อมสิทธิ์ลัดคิวพิเศษ (เรทเดียว 32 บาท) ได้รับคำทำนายด่วนภายใน 12-24 ชั่วโมง', 32, '⚡ ลัดคิว 32.-', true, 3, 'fortune'),
('pkg-4', 'cat-2', '♡ 15 น݁า݂ที     69 บ݁า݂ท ♡ ⃗', '♡ 15 น݁า݂ที     69 บ݁า݂ท ♡ ⃗ คุยสด ถาม-ตอบคลายทุกข้อสงสัยอย่างเป็นกันเอง', 69, '69.-', true, 1, 'fortune'),
('pkg-5', 'cat-2', '♡ 25 น݁า݂ที     89 บ݁า݂ท 𓈒', '♡ 25 น݁า݂ที     89 บ݁า݂ท 𓈒 ปรึกษาเจาะลึกเรื่องความรัก การงาน การเงิน', 89, '89.-', true, 2, 'fortune'),
('pkg-6', 'cat-2', '♡ 45 น݁า݂ที     139 บ݁า݂ท', '♡ 45 น݁า݂ที     139 บ݁า݂ท เคลียร์ทุกเรื่องรอบด้าน ไม่จำกัดจำนวนคำถามในเวลา', 139, '139.-', true, 3, 'fortune'),
('pkg-apple-box', 'cat-3', 'กล่องสุ่ม Lucky Apple Box & เทียนหอม', 'กล่องสุ่มของมงคลนำโชคและเทียนหอมอโรมากลิ่นแอปเปิ้ล จัดส่งพร้อมแพ็กเกจน่ารัก', 199, '199.-', true, 1, 'physical')
ON CONFLICT (id) DO NOTHING;

-- 4. เพิ่มเพลงและรีวิวเริ่มต้น
INSERT INTO music_tracks (id, title, artist, url, is_active, sort_order) VALUES
('song-1', 'Peaceful Apple Breeze', 'Cottage Breeze', 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3', true, 1),
('song-2', 'Acoustic Morning in Garden', 'Sunny Leaf', 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=acoustic-guitars-ambient-uplifting-10118.mp3', true, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (id, customer_name, rating, comment, is_visible) VALUES
('rev-1', 'คุณมิว', 5, 'ภาพวาดน่ารักมากเลยค่ะ ลายเส้นแอปเปิ้ลละมุนใจมาก ร้านส่งงานไวและพูดจาดีมาก แนะนำเลยค่ะ! 🍎❤️', true),
('rev-2', 'คุณพลอย', 5, 'สั่งกล่องสุ่ม Lucky Apple Box มา เปิดออกมาคือน่ารักทุกชิ้น มีกลิ่นหอมเหมือนแอปเปิ้ลจริง ๆ ประทับใจมากค่ะ', true)
ON CONFLICT (id) DO NOTHING;
