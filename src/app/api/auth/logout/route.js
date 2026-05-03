import { clearAuthCookie } from '@/utils/auth';
import { NextResponse } from 'next/server';

export async function POST() {
  await clearAuthCookie();
  return NextResponse.json({ success: true });
}
