import { NextResponse } from 'next/server';
import { getStoreData, saveCategories, saveStoreSettings, saveMusicTracks, saveReviews } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const wantsAdmin = searchParams.get('admin') === 'true' || req.headers.get('x-admin-request') === 'true';

    const isAdmin = wantsAdmin ? await verifyAdminSession(req) : false;

    if (wantsAdmin && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: จำเป็นต้องเข้าสู่ระบบหลังบ้านเพื่อดูข้อมูลนี้' },
        { status: 401 }
      );
    }

    const data = await getStoreData();

    // Sanitize sensitive credentials for public requests
    if (!isAdmin) {
      const sanitizedSettings = { ...data.settings };
      delete sanitizedSettings.line_channel_access_token;
      delete sanitizedSettings.webhook_url;
      delete sanitizedSettings.line_admin_user_id;

      return NextResponse.json({
        success: true,
        data: {
          ...data,
          settings: sanitizedSettings,
        },
      });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการดึงข้อมูลร้านค้า';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const isAdmin = await verifyAdminSession(req);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: จำเป็นต้องเข้าสู่ระบบหลังบ้านเพื่อบันทึกการตั้งค่าร้านค้า' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { action, categories, settings, music_tracks, reviews } = body;

    if (action === 'save_categories' && categories) {
      const saved = await saveCategories(categories);
      return NextResponse.json({ success: true, data: saved });
    }

    if (action === 'save_settings' && settings) {
      const saved = await saveStoreSettings(settings);
      return NextResponse.json({ success: true, data: saved });
    }

    if (action === 'save_music') {
      const tracksToSave = Array.isArray(music_tracks) ? music_tracks : [];
      const saved = await saveMusicTracks(tracksToSave);
      return NextResponse.json({ success: true, data: saved });
    }

    if (action === 'save_reviews') {
      const reviewsToSave = Array.isArray(reviews) ? reviews : [];
      const saved = await saveReviews(reviewsToSave);
      return NextResponse.json({ success: true, data: saved });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูลร้านค้า';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
