import 'server-only';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// ── Types ─────────────────────────────────────────────────
export type PageviewRecord = {
  ts: number;          // Unix ms timestamp
  path: string;        // URL path, e.g. "/menu"
  ref: string;         // Referrer (shortened)
  ipHash: string;      // SHA-256 of IP — no PII stored
  ua: string;          // Simplified UA: 'mobile' | 'tablet' | 'desktop'
};

export type DaySummary = {
  date: string;        // "YYYY-MM-DD"
  views: number;
  unique: number;      // unique ipHash per day
  pages: Record<string, number>;  // path → count
};

export type AnalyticsSummary = {
  totalViews: number;
  totalUnique: number;
  todayViews: number;
  todayUnique: number;
  topPages: { path: string; views: number }[];
  daily: DaySummary[];   // last 30 days
  devices: { desktop: number; mobile: number; tablet: number };
};

// ── Storage ───────────────────────────────────────────────
const DATA_DIR = path.join(process.cwd(), 'src', 'data', 'analytics');

function todayKey() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function dayFile(date: string) {
  return path.join(DATA_DIR, `${date}.json`);
}

function readDay(date: string): PageviewRecord[] {
  const f = dayFile(date);
  if (!fs.existsSync(f)) return [];
  try { return JSON.parse(fs.readFileSync(f, 'utf-8')); }
  catch { return []; }
}

function appendRecord(record: PageviewRecord) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const f = dayFile(todayKey());
  const records = readDay(todayKey());
  records.push(record);
  fs.writeFileSync(f, JSON.stringify(records), 'utf-8');
}

// ── Helpers ───────────────────────────────────────────────
function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip + 'strata-salt').digest('hex').slice(0, 12);
}

function parseUA(ua: string): 'mobile' | 'tablet' | 'desktop' {
  const u = ua.toLowerCase();
  if (/ipad|tablet|kindle|playbook/i.test(u)) return 'tablet';
  if (/mobile|android|iphone|ipod|blackberry|windows phone/i.test(u)) return 'mobile';
  return 'desktop';
}

function shortenRef(ref: string): string {
  if (!ref || ref === 'direct') return 'direct';
  try {
    const url = new URL(ref);
    return url.hostname;
  } catch { return 'direct'; }
}

// Pages to exclude from tracking
const IGNORE_PATHS = ['/admin', '/api', '/_next', '/favicon', '/assets'];

// ── Public API ────────────────────────────────────────────

/** Record a single pageview. Called from middleware / API route. */
export function trackPageview(opts: {
  path: string;
  ip: string;
  ua: string;
  ref: string;
}): void {
  if (IGNORE_PATHS.some((p) => opts.path.startsWith(p))) return;
  appendRecord({
    ts: Date.now(),
    path: opts.path,
    ref: shortenRef(opts.ref),
    ipHash: hashIP(opts.ip),
    ua: parseUA(opts.ua),
  });
}

/** Compute analytics summary for the dashboard. */
export function getAnalyticsSummary(days = 30): AnalyticsSummary {
  if (!fs.existsSync(DATA_DIR)) {
    return { totalViews: 0, totalUnique: 0, todayViews: 0, todayUnique: 0, topPages: [], daily: [], devices: { desktop: 0, mobile: 0, tablet: 0 } };
  }

  const today = todayKey();
  const daily: DaySummary[] = [];
  let totalViews = 0;
  let totalUnique = 0;
  const globalUniqueIPs = new Set<string>();
  const pageCountAll: Record<string, number> = {};
  const devices = { desktop: 0, mobile: 0, tablet: 0 };

  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const date = d.toISOString().slice(0, 10);
    const records = readDay(date);

    const dayIPs = new Set<string>();
    const dayPages: Record<string, number> = {};

    for (const r of records) {
      dayIPs.add(r.ipHash);
      globalUniqueIPs.add(r.ipHash);
      dayPages[r.path] = (dayPages[r.path] ?? 0) + 1;
      pageCountAll[r.path] = (pageCountAll[r.path] ?? 0) + 1;
      devices[r.ua as keyof typeof devices] = (devices[r.ua as keyof typeof devices] ?? 0) + 1;
      totalViews++;
    }

    if (records.length > 0 || i === 0) {
      daily.push({ date, views: records.length, unique: dayIPs.size, pages: dayPages });
    }
  }

  totalUnique = globalUniqueIPs.size;

  const todayData = daily.find((d) => d.date === today);

  const topPages = Object.entries(pageCountAll)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([p, views]) => ({ path: p, views }));

  return {
    totalViews,
    totalUnique,
    todayViews: todayData?.views ?? 0,
    todayUnique: todayData?.unique ?? 0,
    topPages,
    daily: daily.reverse(), // chronological order
    devices,
  };
}
