import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const TOKEN = process.env.ADMIN_TOKEN ?? 'strata2026';
const COOKIE = 'sc_admin';

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (password !== TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, TOKEN, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE);
  return res;
}
