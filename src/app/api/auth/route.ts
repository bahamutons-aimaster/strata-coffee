import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const expected = process.env.ADMIN_TOKEN ?? 'strata2026';
  if (password !== expected) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  }
  cookies().set('sc_admin', expected, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 hari
    sameSite: 'lax',
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  cookies().delete('sc_admin');
  return NextResponse.json({ ok: true });
}
