import { NextRequest, NextResponse } from 'next/server';
import { getContent, saveContent } from '@/lib/content';
import { cookies } from 'next/headers';

function isAuthed() {
  const c = cookies().get('sc_admin');
  return c?.value === (process.env.ADMIN_TOKEN ?? 'strata2026');
}

export async function GET() {
  return NextResponse.json(getContent());
}

export async function PUT(req: NextRequest) {
  if (!isAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    saveContent(body);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
