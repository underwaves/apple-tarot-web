import { NextResponse } from 'next/server';
import { addReview } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { customer_name, rating, comment } = await req.json();

    if (!customer_name || !comment) {
      return NextResponse.json(
        { success: false, error: 'กรุณากรอกชื่อและความคิดเห็น' },
        { status: 400 }
      );
    }

    const review = await addReview({
      customer_name: String(customer_name).trim(),
      rating: Math.max(1, Math.min(Number(rating) || 5, 5)),
      comment: String(comment).trim(),
    });

    return NextResponse.json({ success: true, review });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการส่งรีวิว';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
