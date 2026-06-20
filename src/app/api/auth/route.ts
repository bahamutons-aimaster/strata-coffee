import { NextRequest, NextResponse } from 'next/server';
import { checkPassword, setAuthCookie, clearAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body tidak valid' }, { status: 400 });
  }

  if (!checkPassword(body.password ?? '')) {
    return NextResponse.json({ error: 'Password salah' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  setAuthCookie(res, body.password!); // password udah divalidasi sama dengan ADMIN_TOKEN
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  clearAuthCookie(res);
  return res;
}
