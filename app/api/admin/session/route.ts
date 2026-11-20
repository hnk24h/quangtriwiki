import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession, isUsingDefaultAdminPassword } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ authenticated: false });
  }
  return NextResponse.json({
    authenticated: true,
    email: session.email,
    role: session.role,
    name: session.name,
    usingDefaultPassword: isUsingDefaultAdminPassword(),
  });
}
