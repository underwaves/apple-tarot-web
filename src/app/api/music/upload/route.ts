import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { verifyAdminSession } from '@/lib/auth';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'music');
const MAX_AUDIO_SIZE = 20 * 1024 * 1024; // 20 MB

const ALLOWED_AUDIO_EXTENSIONS = new Set(['.mp3', '.ogg', '.wav', '.m4a', '.aac']);

export async function POST(req: Request) {
  try {
    const isAdmin = await verifyAdminSession(req);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: จำเป็นต้องเข้าสู่ระบบหลังบ้านเพื่ออัปโหลดเพลง' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const title = ((formData.get('title') as string) || '').trim();

    if (!file) {
      return NextResponse.json({ success: false, error: 'กรุณาเลือกไฟล์เสียง' }, { status: 400 });
    }

    if (file.size > MAX_AUDIO_SIZE) {
      return NextResponse.json(
        { success: false, error: 'ขนาดไฟล์เสียงเกิน 20MB กรุณาเลือกไฟล์ขนาดเล็กลง' },
        { status: 400 }
      );
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_AUDIO_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { success: false, error: 'รองรับเฉพาะไฟล์เสียง (.mp3, .ogg, .wav, .m4a, .aac) เท่านั้น' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Secure system generated filename
    const safeFilename = `music_${Date.now()}_${crypto.randomBytes(6).toString('hex')}${ext}`;
    let fileUrl = '';

    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        const { data, error } = await supabaseAdmin.storage
          .from('assets')
          .upload(`music/${safeFilename}`, buffer, {
            contentType: file.type || 'audio/mpeg',
            upsert: false,
          });

        if (!error && data) {
          const { data: publicUrlData } = supabaseAdmin.storage
            .from('assets')
            .getPublicUrl(`music/${safeFilename}`);
          fileUrl = publicUrlData.publicUrl;
        }
      } catch (e) {
        console.warn('Supabase music upload fallback:', e);
      }
    }

    if (!fileUrl) {
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      }
      const filePath = path.join(UPLOAD_DIR, safeFilename);
      fs.writeFileSync(filePath, buffer);
      fileUrl = `/uploads/music/${safeFilename}`;
    }

    return NextResponse.json({
      success: true,
      url: fileUrl,
      title: title || file.name.replace(/\.[^/.]+$/, ''),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์เสียง';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
