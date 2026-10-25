import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { verifyAdminSession } from '@/lib/auth';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'images');
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const EXTENSION_MAP: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

export async function POST(req: Request) {
  try {
    const isAdmin = await verifyAdminSession(req);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: กรุณาเข้าสู่ระบบหลังบ้านเพื่ออัปโหลดรูปภาพ' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'image';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'กรุณาเลือกไฟล์รูปภาพ' },
        { status: 400 }
      );
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'ขนาดรูปภาพเกิน 10MB กรุณาเลือกรูปขนาดเล็กลง' },
        { status: 400 }
      );
    }

    const mimeType = file.type || 'image/jpeg';
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        { success: false, error: 'รองรับเฉพาะไฟล์รูปภาพ .jpg, .png, .webp, .gif เท่านั้น' },
        { status: 400 }
      );
    }

    const ext = EXTENSION_MAP[mimeType] || path.extname(file.name).toLowerCase() || '.png';
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeFilename = `${type}_${Date.now()}_${crypto.randomBytes(6).toString('hex')}${ext}`;

    // 1. Try Supabase Storage if configured
    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        const { data: uploadData, error: uploadErr } = await supabaseAdmin.storage
          .from('store-images')
          .upload(safeFilename, buffer, {
            contentType: mimeType,
            upsert: false,
          });

        if (!uploadErr && uploadData) {
          const { data: publicUrlData } = supabaseAdmin.storage
            .from('store-images')
            .getPublicUrl(safeFilename);
          return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            filename: safeFilename,
          });
        }
      } catch (e) {
        console.warn('Supabase storage upload fallback:', e);
      }
    }

    // 2. Save to local public/uploads/images/
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const filePath = path.join(UPLOAD_DIR, safeFilename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/images/${safeFilename}`;
    const base64Data = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    return NextResponse.json({
      success: true,
      url: dataUrl, // Provide base64 data url to guarantee zero 404s on ephemeral hosting
      localUrl: publicUrl,
      filename: safeFilename,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
