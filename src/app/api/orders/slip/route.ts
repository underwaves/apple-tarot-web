import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getOrder, uploadSlip } from '@/lib/db';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

// Store slips outside public directory to prevent direct execution / unauthenticated public scraping
const SLIP_STORAGE_DIR = path.join(process.cwd(), 'data', 'uploads', 'slips');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

type ImageFormat = { ext: 'jpg' | 'png' | 'webp'; mime: string };

function detectSafeImageFormat(buffer: Buffer): ImageFormat | null {
  if (buffer.length < 12) return null;

  // 1. JPEG: 0xFF 0xD8 0xFF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { ext: 'jpg', mime: 'image/jpeg' };
  }

  // 2. PNG: 0x89 0x50 0x4E 0x47 0x0D 0x0A 0x1A 0x0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { ext: 'png', mime: 'image/png' };
  }

  // 3. WEBP: "RIFF" (0x52 0x49 0x46 0x46) ... "WEBP" (0x57 0x45 0x42 0x50)
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { ext: 'webp', mime: 'image/webp' };
  }

  // Any other file type (SVG, HTML, EXE, JS, etc.) is rejected
  return null;
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';

    let orderNo = '';
    let trackingToken = '';
    let fileBuffer: Buffer | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      orderNo = ((formData.get('order_no') as string) || '').trim();
      trackingToken = ((formData.get('tracking_token') as string) || '').trim();
      const file = formData.get('file') as File | null;

      if (!orderNo || !file) {
        return NextResponse.json(
          { success: false, error: 'ข้อมูลไม่ครบถ้วน (ต้องระบุหมายเลขออเดอร์และไฟล์สลิป)' },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      fileBuffer = Buffer.from(bytes);
    } else {
      // JSON format with base64 data URL
      const body = await req.json();
      orderNo = (body.order_no || '').trim();
      trackingToken = (body.tracking_token || '').trim();
      const base64Data = body.slip_data;

      if (!orderNo || !base64Data) {
        return NextResponse.json(
          { success: false, error: 'ข้อมูลไม่ครบถ้วน (ต้องระบุหมายเลขออเดอร์และรูปสลิป)' },
          { status: 400 }
        );
      }

      if (typeof base64Data === 'string' && base64Data.startsWith('data:')) {
        const matches = base64Data.match(/^data:[^;]+;base64,(.+)$/);
        if (matches && matches[1]) {
          fileBuffer = Buffer.from(matches[1], 'base64');
        }
      } else if (typeof base64Data === 'string') {
        fileBuffer = Buffer.from(base64Data, 'base64');
      }
    }

    if (!fileBuffer || fileBuffer.length === 0) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบข้อมูลไฟล์รูปภาพสลิป' },
        { status: 400 }
      );
    }

    // Server-side file size check
    if (fileBuffer.length > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'ขนาดไฟล์เกิน 5MB กรุณาเลือกรูปขนาดเล็กลง' },
        { status: 400 }
      );
    }

    // Inspect actual file content magic bytes
    const detectedFormat = detectSafeImageFormat(fileBuffer);
    if (!detectedFormat) {
      return NextResponse.json(
        {
          success: false,
          error: 'รูปแบบไฟล์ไม่ปลอดภัย กรุณาอัปโหลดรูปภาพสลิป (.jpg, .png, .webp) เท่านั้น',
        },
        { status: 400 }
      );
    }

    // Verify order exists before saving any file to disk or storage
    const existingOrder = await getOrder(orderNo);
    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบหมายเลขคำสั่งซื้อนี้ในระบบ' },
        { status: 404 }
      );
    }

    if (trackingToken && existingOrder.tracking_token && existingOrder.tracking_token !== trackingToken) {
      return NextResponse.json(
        { success: false, error: 'รหัสติดตามออเดอร์ไม่ถูกต้อง' },
        { status: 403 }
      );
    }

    if (existingOrder.status === 'confirmed' || existingOrder.status === 'cancelled') {
      return NextResponse.json(
        {
          success: false,
          error: `คำสั่งซื้อนี้อยู่ในสถานะ ${existingOrder.status} ไม่สามารถอัปโหลดสลิปซ้ำได้`,
        },
        { status: 400 }
      );
    }

    // Generate secure, random system filename
    const safeFilename = `slip_${crypto.randomUUID()}.${detectedFormat.ext}`;
    let slipUrl = '';

    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        const { data: uploadData, error: uploadErr } = await supabaseAdmin.storage
          .from('slips')
          .upload(safeFilename, fileBuffer, {
            contentType: detectedFormat.mime,
            upsert: false,
          });

        if (!uploadErr && uploadData) {
          const { data: publicUrlData } = supabaseAdmin.storage
            .from('slips')
            .getPublicUrl(safeFilename);
          slipUrl = publicUrlData.publicUrl;
        }
      } catch (e) {
        console.warn('Supabase storage upload fallback:', e);
      }
    }

    if (!slipUrl) {
      if (!fs.existsSync(SLIP_STORAGE_DIR)) {
        fs.mkdirSync(SLIP_STORAGE_DIR, { recursive: true });
      }
      const filePath = path.join(SLIP_STORAGE_DIR, safeFilename);
      fs.writeFileSync(filePath, fileBuffer);

      // Store Base64 Data URL directly into order.slip_url so slips are permanently
      // preserved and never lost even when Render free tier restarts or redeploys!
      const base64Data = fileBuffer.toString('base64');
      slipUrl = `data:${detectedFormat.mime};base64,${base64Data}`;
    }

    const updatedOrder = await uploadSlip(orderNo, slipUrl, safeFilename);
    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการอัปโหลดสลิป';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
