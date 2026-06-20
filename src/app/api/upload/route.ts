import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { isAuthed } from '@/lib/auth';

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const ext = file.name.split('.').pop() ?? 'jpg';
  const fname = `uploads/upload-${Date.now()}.${ext}`;

  // PENTING: ini gak nulis ke disk server lagi (gak akan jalan di Vercel),
  // tapi upload ke Vercel Blob — hasilnya berupa URL publik penuh
  // (https://xxxxx.public.blob.vercel-storage.com/...), BUKAN path relatif
  // kayak '/assets/uploads/...' yang lama.
  const blob = await put(fname, file, {
    access: 'public',
    addRandomSuffix: false,
  });

  return NextResponse.json({ url: blob.url });
}
