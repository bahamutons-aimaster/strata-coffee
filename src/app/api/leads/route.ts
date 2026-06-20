import { NextRequest, NextResponse } from 'next/server';
import { getAllLeads, saveLead, updateLeadStatus } from '@/lib/leads';
import { isAuthed } from '@/lib/auth';

/** GET — admin only: list semua leads (terbaru duluan) */
export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const leads = await getAllLeads();
  return NextResponse.json(leads);
}

/** POST — publik: dipanggil dari live chat widget / form kontak / klaim promo / gift card */
export async function POST(req: NextRequest) {
  let body: {
    source?: string;
    name?: string;
    phone?: string;
    email?: string;
    message?: string;
    voucherCode?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body tidak valid' }, { status: 400 });
  }

  const validSources = ['chat', 'contact', 'gift-card', 'promo'] as const;
  const source = validSources.includes(body.source as (typeof validSources)[number])
    ? (body.source as (typeof validSources)[number])
    : 'contact';

  if (!body.name || !body.message) {
    return NextResponse.json({ error: 'Nama dan pesan wajib diisi' }, { status: 400 });
  }

  const lead = await saveLead({
    source,
    name: body.name,
    phone: body.phone,
    email: body.email,
    message: body.message,
    voucherCode: body.voucherCode,
  });

  return NextResponse.json({ ok: true, id: lead.id });
}

/** PATCH — admin only: update status lead ({ id, status }) */
export async function PATCH(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let body: { id?: string; status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body tidak valid' }, { status: 400 });
  }
  const validStatuses = ['new', 'read', 'replied', 'done'] as const;
  if (!body.id || !validStatuses.includes(body.status as (typeof validStatuses)[number])) {
    return NextResponse.json({ error: 'id dan status wajib diisi dengan benar' }, { status: 400 });
  }
  const ok = await updateLeadStatus(body.id, body.status as (typeof validStatuses)[number]);
  if (!ok) return NextResponse.json({ error: 'Lead tidak ditemukan' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
