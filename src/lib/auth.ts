import 'server-only';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * Satu sistem auth dipakai SEMUA route (auth, content, leads, analytics, upload).
 * Sebelumnya ada 2 versi berbeda (cookie 'strata_admin' vs 'sc_admin', env var
 * 'ADMIN_PASSWORD' vs 'ADMIN_TOKEN') yang bikin sebagian route selalu nolak
 * walau password-nya benar. Sekarang cuma ada SATU definisi di file ini.
 */
export const ADMIN_COOKIE = 'sc_admin';

/**
 * PENTING: gak ada lagi default password yang ke-hardcode ('strata2026').
 * Kalau ADMIN_TOKEN belum di-set di environment variable, sistem akan
 * menolak SEMUA login (bukan diam-diam pakai password rahasia bawaan).
 */
export function getAdminToken(): string | null {
  return process.env.ADMIN_TOKEN || null;
}

export function checkPassword(input: string): boolean {
  const expected = getAdminToken();
  if (!expected) return false; // ADMIN_TOKEN belum di-set → tolak semua
  return input === expected;
}

/** Cek status login dari cookie request yang masuk (dipakai di GET/PUT/PATCH/dll). */
export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  const expected = getAdminToken();
  if (!expected) return false;
  return token === expected;
}

/** Pasang cookie session di response (dipanggil dari POST /api/auth). */
export function setAuthCookie(res: NextResponse, token: string): void {
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  });
}

/** Hapus cookie session (dipanggil dari DELETE /api/auth). */
export function clearAuthCookie(res: NextResponse): void {
  res.cookies.delete(ADMIN_COOKIE);
}
