import 'server-only';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE = 'strata_admin';

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'strata2026';
}

export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === 'true';
}
