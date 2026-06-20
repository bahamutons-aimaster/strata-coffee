import 'server-only';
import { readJson, writeJson, listBlobs } from './blob';

export type Lead = {
  id: string;
  createdAt: string;      // ISO timestamp
  source: 'chat' | 'contact' | 'gift-card' | 'promo';
  name: string;
  phone?: string;
  email?: string;
  message: string;
  /** Voucher code yang diklaim (kalau dari promo) */
  voucherCode?: string;
  /** Status tindak lanjut */
  status: 'new' | 'read' | 'replied' | 'done';
};

/**
 * Setiap lead disimpan sebagai blob TERPISAH (leads/{id}.json), bukan satu
 * file array besar seperti sebelumnya. Ini sengaja — kalau semua lead nimpuk
 * di satu file, dua orang submit form barengan bisa saling timpa (yang satu
 * "menang" race condition, lead yang lain hilang). Dengan 1 file per lead,
 * submit baru gak pernah nabrak submit lain.
 */
const PREFIX = 'leads/';

function leadPath(id: string) {
  return `${PREFIX}${id}.json`;
}

export async function getAllLeads(): Promise<Lead[]> {
  const blobs = await listBlobs(PREFIX);
  const leads = await Promise.all(
    blobs.map((b) => readJson<Lead>(b.pathname))
  );
  return leads
    .filter((l): l is Lead => l !== null)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function saveLead(data: Omit<Lead, 'id' | 'createdAt' | 'status'>): Promise<Lead> {
  const lead: Lead = {
    id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
    status: 'new',
    ...data,
  };
  await writeJson(leadPath(lead.id), lead);
  return lead;
}

export async function updateLeadStatus(id: string, status: Lead['status']): Promise<boolean> {
  const lead = await readJson<Lead>(leadPath(id));
  if (!lead) return false;
  lead.status = status;
  await writeJson(leadPath(id), lead);
  return true;
}
