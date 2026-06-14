import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsSummary, trackPageview } from '@/lib/analytics';
import { cookies } from 'next/headers';

async function isAuthed() {
  const cookieStore = await cookies();
  const c = cookieStore.get('sc_admin');
  return c?.value === (process.env.ADMIN_TOKEN ?? 'strata2026');
}

/** GET — admin: ambil summary analytics */
export async function GET() {
  if (!await isAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(getAnalyticsSummary(30));
}

/** POST — catat pageview (dipanggil dari client saat halaman load) */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      '0.0.0.0';
    const ua = req.headers.get('user-agent') ?? '';
    const ref = body.ref ?? 'direct';
    const pagePath = body.path ?? '/';

    trackPageview({ path: pagePath, ip, ua, ref });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
