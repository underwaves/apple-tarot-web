import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyAdminSession } from '@/lib/auth';
import { getAllOrders } from '@/lib/db';

function getSlipStorageDir(): string {
  return process.env.SLIP_STORAGE_DIR
    ? path.resolve(process.env.SLIP_STORAGE_DIR)
    : path.join(process.cwd(), 'data', 'uploads', 'slips');
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // Strict filename check to prevent directory traversal
    if (!filename || !/^slip_[a-zA-Z0-9-]+\.(jpg|jpeg|png|webp)$/i.test(filename)) {
      return NextResponse.json({ success: false, error: 'Invalid filename' }, { status: 400 });
    }

    const safeBase = path.basename(filename);
    const filePath = path.join(getSlipStorageDir(), safeBase);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ success: false, error: 'Slip not found' }, { status: 404 });
    }

    // Access control: Only authenticated admin or customer with matching tracking token can view
    const isAdmin = await verifyAdminSession(req);
    if (!isAdmin) {
      const url = new URL(req.url);
      const trackingToken =
        url.searchParams.get('tracking_token') ||
        url.searchParams.get('token') ||
        req.headers.get('x-tracking-token');

      if (!trackingToken) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized: Admin authentication or order tracking token required' },
          { status: 401 }
        );
      }

      const orders = await getAllOrders();
      const belongsToOrder = orders.some(
        (o) =>
          o.tracking_token === trackingToken &&
          (o.slip_filename === safeBase || (o.slip_url && o.slip_url.includes(safeBase)))
      );

      if (!belongsToOrder) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized: Invalid tracking token for this slip' },
          { status: 403 }
        );
      }
    }

    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(safeBase).toLowerCase();
    const mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'; sandbox",
        'Content-Disposition': 'inline',
        'Cache-Control': 'private, no-transform, max-age=86400',
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error retrieving slip';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
