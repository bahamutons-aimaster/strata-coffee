import { AdminPanel } from './AdminPanel';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('sc_admin')?.value;
  const authed = token === (process.env.ADMIN_TOKEN ?? 'strata2026');
  return <AdminPanel initialAuthed={authed} />;
}
