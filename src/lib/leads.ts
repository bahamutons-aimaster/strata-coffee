import 'server-only';
import fs from 'fs';
import path from 'path';

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

const LEADS_PATH = path.join(process.cwd(), 'src', 'data', 'leads.json');

function readLeads(): Lead[] {
  try {
    if (!fs.existsSync(LEADS_PATH)) return [];
    return JSON.parse(fs.readFileSync(LEADS_PATH, 'utf-8')) as Lead[];
  } catch {
    return [];
  }
}

function writeLeads(leads: Lead[]): void {
  const dir = path.dirname(LEADS_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(LEADS_PATH, JSON.stringify(leads, null, 2), 'utf-8');
}

export function getAllLeads(): Lead[] {
  return readLeads().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function saveLead(data: Omit<Lead, 'id' | 'createdAt' | 'status'>): Lead {
  const leads = readLeads();
  const lead: Lead = {
    id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
    status: 'new',
    ...data,
  };
  leads.push(lead);
  writeLeads(leads);
  return lead;
}

export function updateLeadStatus(id: string, status: Lead['status']): boolean {
  const leads = readLeads();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx === -1) return false;
  leads[idx].status = status;
  writeLeads(leads);
  return true;
}
