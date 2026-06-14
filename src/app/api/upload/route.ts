import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { writeFile } from 'fs/promises';
import path from 'path';

function isAuthed() {
  const c = cookies().get('sc_admin');
  return c?.value === (process.env.ADMIN_TOKEN ?? 'strata2026');
}

export async function POST(req: NextRequest) {
  if (!isAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
  const ext = file.name.split('.').pop() ?? 'jpg';
  const fname = `upload-${Date.now()}.${ext}`;
  const bytes = await file.arrayBuffer();
  const dest = path.join(process.cwd(), 'public', 'assets', 'uploads', fname);
  await writeFile(dest, new Uint8Array(bytes));
  return NextResponse.json({ url: `/assets/uploads/${fname}` });
}
