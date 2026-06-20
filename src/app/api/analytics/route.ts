import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsSummary, trackPageview } from '@/lib/analytics';
import { isAuthed } from '@/lib/auth';

/** GET — admin: ambil summary analytics */
export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const summary = await getAnalyticsSummary(30);
  return NextResponse.json(summary);
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

    await trackPageview({ path: pagePath, ip, ua, ref });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
