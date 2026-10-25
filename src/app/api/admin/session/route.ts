import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';

export async function GET(req: Request) {
  const isAuthenticated = await verifyAdminSession(req);
  return NextResponse.json({
    success: true,
    authenticated: isAuthenticated,
  });
}
