'use client';

import { useEffect, useState, useRef } from 'react';
import type { SiteContent, HeroSlide, StoryChapter, Drink, SiteInfo, Article, ShowcaseSlide } from '@/lib/content';
import s from './admin.module.css';

// ─── LoginForm (tetap pakai strata-login.module.css) ────────────
import { LoginForm } from './LoginForm';

// ─── Main Panel ──────────────────────────────────────────────────
type Tab = 'analytics' | 'hero' | 'showcase' | 'story' | 'drinks' | 'articles' | 'promo' | 'leads' | 'site';

export function AdminPanel({ initialAuthed }: { initialAuthed: boolean }) {
  const [authed, setAuthed] = useState(initialAuthed);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [tab, setTab] = useState<Tab>('analytics');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!authed) return;
    fetch('/api/content').then((r) => r.json()).then(setContent);
  }, [authed]);

  async function save() {
    if (!content) return;
    setSaving(true);
    await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function logout() {
    await fetch('/api/auth', { method: 'DELETE' });
    setAuthed(false);
    setContent(null);
  }

  if (!authed) return <LoginForm onSuccess={() => setAuthed(true)} />;
  if (!content) return <div className={s.loading}>Memuat konten…</div>;

  const TABS: { id: Tab; label: string; emoji: string; shortLabel: string }[] = [
    { id: 'analytics', label: 'Analytics',    emoji: '📊', shortLabel: 'Stats' },
    { id: 'hero',      label: 'Hero Slides',  emoji: '🖼️', shortLabel: 'Hero' },
    { id: 'showcase',  label: 'Showcase',     emoji: '🎞️', shortLabel: 'Slide' },
    { id: 'story',     label: 'Scroll Story', emoji: '📖', shortLabel: 'Story' },
    { id: 'drinks',    label: 'Menu & Drinks',emoji: '☕', shortLabel: 'Menu' },
    { id: 'articles',  label: 'News & Blog',  emoji: '📝', shortLabel: 'Blog' },
    { id: 'promo',     label: 'Promo Popup',  emoji: '🎟️', shortLabel: 'Promo' },
    { id: 'leads',     label: 'Pesan Masuk',  emoji: '📨', shortLabel: 'Pesan' },
    { id: 'site',      label: 'Info Cafe',    emoji: '📍', shortLabel: 'Cafe' },
  ];

  const activeLabel = TABS.find((t) => t.id === tab)?.label ?? '';

  const CONTENT_TABS: Tab[] = ['hero', 'showcase', 'story', 'drinks', 'articles'];
  const CRM_TABS: Tab[] = ['promo', 'leads', 'site'];

  // Map tab id ke icon (Tabler icon class)
  const TAB_ICONS: Record<Tab, string> = {
    analytics: 'ti-chart-bar',
    hero:      'ti-photo',
    showcase:  'ti-layout-grid',
    story:     'ti-book',
    drinks:    'ti-coffee',
    articles:  'ti-file-text',
    promo:     'ti-ticket',
    leads:     'ti-inbox',
    site:      'ti-map-pin',
  };

  return (
    <div className={s.shell}>
      {/* Background foto */}
      <div className={s.shellBg} aria-hidden />
      <div className={s.shellBgOverlay} aria-hidden />

      {/* ── Sidebar icon-only ── */}
      <aside className={s.sidebar}>
        <div className={s.sideLogoWrap}>
          <img src="/assets/logo-strata.png" alt="Strata Coffee" width={44} height={44} />
        </div>

        <nav className={s.sideNav}>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`${s.sideLink} ${tab === t.id ? s.sideLinkActive : ''}`}
              onClick={() => setTab(t.id)}
              aria-label={t.label}
            >
              <i className={`ti ${TAB_ICONS[t.id]} ${s.sideLinkIcon}`} aria-hidden="true" />
              <span className={s.sideLinkLabel}>{t.shortLabel}</span>
              {t.id === 'leads' && <LeadsBadge />}
            </button>
          ))}
        </nav>

        <div className={s.sideFooter}>
          <a href="/" className={s.viewSite} target="_blank" rel="noopener" aria-label="Lihat Situs">
            <i className={`ti ti-external-link ${s.viewSiteIcon}`} aria-hidden="true" />
            <span className={s.viewSiteLabel}>Situs</span>
          </a>
          <button onClick={logout} className={s.logoutBtn} aria-label="Logout">
            <i className={`ti ti-logout ${s.logoutBtnIcon}`} aria-hidden="true" />
            <span className={s.logoutBtnLabel}>Keluar</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className={s.main}>
        <div className={s.topBar}>
          <div className={s.pageTitleWrap}>
            <span className={s.pageEyebrow}>Strata Coffee · Admin</span>
            <h2 className={s.pageTitle}>{activeLabel}</h2>
          </div>
          <div className={s.topBarRight}>
            <div className={s.statusPill}>Bandungan · 720m</div>
            <button onClick={save} className={s.saveBtn} disabled={saving}>
              {saving
                ? <><i className="ti ti-loader-2" aria-hidden="true" style={{fontSize:15, animation:'spin 1s linear infinite'}} /> Menyimpan…</>
                : saved
                ? <><i className="ti ti-check" aria-hidden="true" style={{fontSize:15}} /> Tersimpan!</>
                : <><i className="ti ti-device-floppy" aria-hidden="true" style={{fontSize:15}} /> Simpan Semua</>
              }
            </button>
          </div>
        </div>

        {tab === 'analytics' && <AnalyticsDashboard />}
        {tab === 'showcase' && (
          <ShowcaseEditor
            slides={content.showcase.slides}
            onChange={(slides) => setContent({ ...content, showcase: { slides } })}
          />
        )}
        {tab === 'hero' && (
          <HeroEditor
            slides={content.hero.slides}
            onChange={(slides) => setContent({ ...content, hero: { slides } })}
          />
        )}
        {tab === 'story' && (
          <StoryEditor
            chapters={content.story.chapters}
            onChange={(chapters) => setContent({ ...content, story: { chapters } })}
          />
        )}
        {tab === 'drinks' && (
          <DrinksEditor
            drinks={content.drinks}
            onChange={(drinks) => setContent({ ...content, drinks })}
          />
        )}
        {tab === 'articles' && (
          <ArticlesEditor
            articles={content.articles}
            onChange={(articles) => setContent({ ...content, articles })}
          />
        )}
        {tab === 'promo' && (
          <PromoEditor
            site={content.site}
            onChange={(site) => setContent({ ...content, site })}
            onUpload={(url) => setContent({ ...content, site: { ...content.site, promoBgImage: url } })}
          />
        )}
        {tab === 'leads' && <LeadsPanel />}
        {tab === 'site' && (
          <SiteEditor
            site={content.site}
            onChange={(site) => setContent({ ...content, site })}
          />
        )}
      </main>
    </div>
  );
}

// ─── Leads Badge (live count) ─────────────────────────────────────
function LeadsBadge() {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    fetch('/api/leads')
      .then((r) => r.json())
      .then((data: { status: string }[]) => {
        if (Array.isArray(data)) setCount(data.filter((l) => l.status === 'new').length);
      })
      .catch(() => {});
  }, []);
  if (!count) return null;
  return <span className={s.navBadge}>{count}</span>;
}

// ─── Hero Slides Editor ───────────────────────────────────────────
function HeroEditor({ slides, onChange }: { slides: HeroSlide[]; onChange: (s: HeroSlide[]) => void }) {
  function update(i: number, patch: Partial<HeroSlide>) {
    onChange(slides.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  }
  function add() {
    onChange([...slides, {
      id: `slide-${Date.now()}`,
      eyebrow: 'EST. 2026 · BANDUNGAN',
      titleLines: ['NEW', 'SLIDE'],
      subtitle: 'Deskripsi singkat minuman atau momen.',
      image: '/assets/products/es-kopi-susu.png',
      productName: 'Nama Minuman',
      productPrice: 25000,
      ctaLabel: 'Lihat Menu',
      ctaHref: '/menu',
    }]);
  }
  function remove(i: number) { onChange(slides.filter((_, j) => j !== i)); }

  return (
    <div className={s.editorList}>
      {slides.map((slide, i) => (
        <div key={slide.id} className={s.card}>
          <div className={s.cardHead}>
            <strong>Slide {i + 1} — {slide.productName}</strong>
            <button className={s.btnDanger} onClick={() => remove(i)}>Hapus</button>
          </div>
          <div className={s.fieldGrid}>
            <label className={s.label}>Eyebrow<input className={s.input} value={slide.eyebrow} onChange={(e) => update(i, { eyebrow: e.target.value })} /></label>
            <label className={s.label}>Nama Produk<input className={s.input} value={slide.productName} onChange={(e) => update(i, { productName: e.target.value })} /></label>
            <label className={s.label}>Harga (IDR)<input className={s.input} type="number" value={slide.productPrice} onChange={(e) => update(i, { productPrice: +e.target.value })} /></label>
            <label className={s.label}>
              Baris Judul (satu per baris)
              <textarea className={s.textarea} value={slide.titleLines.join('\n')} rows={3} onChange={(e) => update(i, { titleLines: e.target.value.split('\n') })} />
            </label>
            <label className={s.label}>Subjudul<textarea className={s.textarea} value={slide.subtitle} rows={3} onChange={(e) => update(i, { subtitle: e.target.value })} /></label>
            <label className={s.label}>Path Gambar<input className={s.input} value={slide.image} onChange={(e) => update(i, { image: e.target.value })} /></label>
            <label className={s.label}>Teks CTA<input className={s.input} value={slide.ctaLabel} onChange={(e) => update(i, { ctaLabel: e.target.value })} /></label>
            <label className={s.label}>Link CTA<input className={s.input} value={slide.ctaHref} onChange={(e) => update(i, { ctaHref: e.target.value })} /></label>
          </div>
          <UploadField label="Ganti Gambar Slide" onUploaded={(url) => update(i, { image: url })} />
        </div>
      ))}
      <button className={s.btnAdd} onClick={add}>+ Tambah Slide</button>
    </div>
  );
}

// ─── Story Editor ─────────────────────────────────────────────────
function StoryEditor({ chapters, onChange }: { chapters: StoryChapter[]; onChange: (c: StoryChapter[]) => void }) {
  function update(i: number, patch: Partial<StoryChapter>) {
    onChange(chapters.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  }
  function add() {
    onChange([...chapters, {
      id: `chapter-${Date.now()}`,
      time: '10:00 · SIANG HARI',
      title: 'Chapter baru.',
      body: 'Cerita tentang Strata Coffee di waktu ini.',
      image: '/assets/photos/rooftop-view.png',
      tintFrom: 'rgba(207,214,220,0.15)',
      tintTo: 'rgba(10,10,11,0.75)',
    }]);
  }

  return (
    <div className={s.editorList}>
      {chapters.map((ch, i) => (
        <div key={ch.id} className={s.card}>
          <div className={s.cardHead}><strong>Chapter {i + 1} — {ch.title}</strong></div>
          <div className={s.fieldGrid}>
            <label className={s.label}>Waktu<input className={s.input} value={ch.time} onChange={(e) => update(i, { time: e.target.value })} /></label>
            <label className={s.label}>Judul<input className={s.input} value={ch.title} onChange={(e) => update(i, { title: e.target.value })} /></label>
            <label className={s.label}>Narasi<textarea className={s.textarea} value={ch.body} rows={4} onChange={(e) => update(i, { body: e.target.value })} /></label>
            <label className={s.label}>Path Foto<input className={s.input} value={ch.image} onChange={(e) => update(i, { image: e.target.value })} /></label>
            <label className={s.label}>Warna Tint Atas<input className={s.input} value={ch.tintFrom} onChange={(e) => update(i, { tintFrom: e.target.value })} /></label>
            <label className={s.label}>Warna Tint Bawah<input className={s.input} value={ch.tintTo} onChange={(e) => update(i, { tintTo: e.target.value })} /></label>
          </div>
          <UploadField label="Ganti Foto Background" onUploaded={(url) => update(i, { image: url })} />
        </div>
      ))}
      <button className={s.btnAdd} onClick={add}>+ Tambah Chapter</button>
    </div>
  );
}

// ─── Drinks Editor ────────────────────────────────────────────────
function DrinksEditor({ drinks, onChange }: { drinks: Drink[]; onChange: (d: Drink[]) => void }) {
  function update(i: number, patch: Partial<Drink>) {
    onChange(drinks.map((d, j) => (j === i ? { ...d, ...patch } : d)));
  }

  return (
    <div className={s.editorList}>
      {drinks.map((drink, i) => (
        <div key={drink.id} className={s.card}>
          <div className={s.cardHead}>
            <strong>{drink.name}</strong>
            <span className={s.badge}>{drink.category}</span>
          </div>
          <div className={s.fieldGrid}>
            <label className={s.label}>Nama<input className={s.input} value={drink.name} onChange={(e) => update(i, { name: e.target.value })} /></label>
            <label className={s.label}>
              Kategori
              <select className={s.select} value={drink.category} onChange={(e) => update(i, { category: e.target.value as Drink['category'] })}>
                <option value="signature">Signature</option>
                <option value="coffee">Coffee</option>
                <option value="non-coffee">Non-Coffee</option>
                <option value="tea">Tea</option>
              </select>
            </label>
            <label className={s.label}>Harga (IDR)<input className={s.input} type="number" value={drink.price} onChange={(e) => update(i, { price: +e.target.value })} /></label>
            <label className={s.label}>Deskripsi<textarea className={s.textarea} value={drink.description} rows={3} onChange={(e) => update(i, { description: e.target.value })} /></label>
            <label className={s.label}>Path Foto<input className={s.input} value={drink.image ?? ''} onChange={(e) => update(i, { image: e.target.value || undefined })} /></label>
            <div className={s.colorRow}>
              <label className={s.label}>Atas<input type="color" className={s.colorInput} value={drink.colors.top} onChange={(e) => update(i, { colors: { ...drink.colors, top: e.target.value } })} /></label>
              <label className={s.label}>Tengah<input type="color" className={s.colorInput} value={drink.colors.middle} onChange={(e) => update(i, { colors: { ...drink.colors, middle: e.target.value } })} /></label>
              <label className={s.label}>Bawah<input type="color" className={s.colorInput} value={drink.colors.bottom} onChange={(e) => update(i, { colors: { ...drink.colors, bottom: e.target.value } })} /></label>
            </div>
            <label className={s.label} style={{ gridColumn: '1/-1', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" checked={!!drink.featured} onChange={(e) => update(i, { featured: e.target.checked })} />
              Tampilkan di Home (featured)
            </label>
          </div>
          <UploadField label="Upload Foto Minuman" onUploaded={(url) => update(i, { image: url })} />
        </div>
      ))}
    </div>
  );
}

// ─── Articles Editor ──────────────────────────────────────────────
function ArticlesEditor({ articles, onChange }: { articles: Article[]; onChange: (a: Article[]) => void }) {
  function update(i: number, patch: Partial<Article>) {
    onChange(articles.map((a, j) => (j === i ? { ...a, ...patch } : a)));
  }
  function add() {
    const id = `art-${Date.now()}`;
    onChange([...articles, {
      id,
      slug: `artikel-baru-${Date.now()}`,
      title: 'Judul Artikel Baru',
      excerpt: 'Ringkasan singkat artikel ini.',
      content: `## Mulai dari sini\n\nTulis konten di sini.`,
      coverImage: '/assets/photos/rooftop-view.png',
      category: 'cerita',
      author: 'Tim Strata',
      publishedAt: new Date().toISOString().slice(0, 10),
      featured: false,
      readingTime: 3,
    }]);
  }
  function remove(i: number) {
    if (!confirm('Hapus artikel ini?')) return;
    onChange(articles.filter((_, j) => j !== i));
  }

  return (
    <div className={s.editorList}>
      {articles.map((a, i) => (
        <div key={a.id} className={s.card}>
          <div className={s.cardHead}>
            <strong>{a.title}</strong>
            <div style={{ display: 'flex', gap: 8 }}>
              <span className={s.badge}>{a.category}</span>
              {a.featured && <span className={s.badge} style={{ background: 'rgba(201,168,76,0.14)', color: '#C9A84C', borderColor: 'rgba(201,168,76,0.25)' }}>★ Featured</span>}
              <button className={s.btnDanger} onClick={() => remove(i)}>Hapus</button>
            </div>
          </div>
          <div className={s.fieldGrid}>
            <label className={s.label}>Judul<input className={s.input} value={a.title} onChange={(e) => update(i, { title: e.target.value })} /></label>
            <label className={s.label}>Slug URL<input className={s.input} value={a.slug} onChange={(e) => update(i, { slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} /></label>
            <label className={s.label}>
              Kategori
              <select className={s.select} value={a.category} onChange={(e) => update(i, { category: e.target.value as Article['category'] })}>
                <option value="cerita">Cerita</option>
                <option value="kopi">Kopi</option>
                <option value="event">Event</option>
                <option value="tips">Tips</option>
              </select>
            </label>
            <label className={s.label}>Penulis<input className={s.input} value={a.author} onChange={(e) => update(i, { author: e.target.value })} /></label>
            <label className={s.label}>Tanggal Terbit<input className={s.input} type="date" value={a.publishedAt} onChange={(e) => update(i, { publishedAt: e.target.value })} /></label>
            <label className={s.label}>Est. Baca (menit)<input className={s.input} type="number" value={a.readingTime} onChange={(e) => update(i, { readingTime: +e.target.value })} /></label>
            <label className={s.label} style={{ gridColumn: '1/-1' }}>
              Ringkasan
              <textarea className={s.textarea} value={a.excerpt} rows={2} onChange={(e) => update(i, { excerpt: e.target.value })} />
            </label>
            <label className={s.label} style={{ gridColumn: '1/-1' }}>
              Konten (Markdown)
              <textarea
                className={s.textarea}
                value={a.content}
                rows={16}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.83rem', lineHeight: 1.6 }}
                onChange={(e) => update(i, { content: e.target.value })}
              />
            </label>
            <label className={s.label}>Path Cover<input className={s.input} value={a.coverImage} onChange={(e) => update(i, { coverImage: e.target.value })} /></label>
            <label className={s.label} style={{ gridColumn: '1/-1', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" checked={a.featured} onChange={(e) => update(i, { featured: e.target.checked })} />
              Featured — tampil besar di halaman News & Home
            </label>
          </div>
          <UploadField label="Upload Cover Image" onUploaded={(url) => update(i, { coverImage: url })} />
        </div>
      ))}
      <button className={s.btnAdd} onClick={add}>+ Tulis Artikel Baru</button>
    </div>
  );
}

// ─── Site Editor ──────────────────────────────────────────────────
function SiteEditor({ site, onChange }: { site: SiteInfo; onChange: (s: SiteInfo) => void }) {
  function upd(patch: Partial<SiteInfo>) { onChange({ ...site, ...patch }); }
  const fields: [string, string][] = [
    ['address', 'Alamat lengkap'],
    ['mapsUrl', 'URL Google Maps'],
    ['lat', 'Latitude'],
    ['lng', 'Longitude'],
    ['altitude', 'Altitude (cth: 720m)'],
    ['hoursWeekday', 'Jam Senin–Kamis'],
    ['hoursFriday', 'Jam Jumat'],
    ['hoursWeekend', 'Jam Sabtu–Minggu'],
    ['whatsapp', 'Nomor WhatsApp'],
    ['email', 'Email'],
    ['instagram', 'URL Instagram'],
    ['tiktok', 'URL TikTok'],
  ];
  return (
    <div className={s.editorList}>
      <div className={s.card}>
        <div className={s.fieldGrid}>
          {fields.map(([key, label]) => (
            <label key={key} className={s.label}>
              {label}
              <input className={s.input} value={String((site as Record<string, unknown>)[key] ?? '')} onChange={(e) => upd({ [key]: e.target.value })} />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Promo Editor ─────────────────────────────────────────────────
function PromoEditor({ site, onChange, onUpload }: { site: SiteInfo; onChange: (s: SiteInfo) => void; onUpload: (url: string) => void }) {
  function upd(patch: Partial<SiteInfo>) { onChange({ ...site, ...patch }); }
  return (
    <div className={s.editorList}>
      <div className={s.card}>
        <div className={s.cardHead}><strong>Popup Promo & Voucher</strong></div>
        <div className={s.fieldGrid}>
          <label className={s.label} style={{ gridColumn: '1/-1', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <input type="checkbox" checked={!!site.promoEnabled} onChange={(e) => upd({ promoEnabled: e.target.checked })} />
            Aktifkan popup promo (muncul 1.5 detik setelah halaman dibuka, sekali per sesi)
          </label>
          <label className={s.label}>Badge<input className={s.input} value={site.promoBadge ?? ''} onChange={(e) => upd({ promoBadge: e.target.value })} /></label>
          <label className={s.label}>Kode Voucher<input className={s.input} value={site.promoCode ?? ''} onChange={(e) => upd({ promoCode: e.target.value.toUpperCase() })} style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.14em' }} /></label>
          <label className={s.label} style={{ gridColumn: '1/-1' }}>Judul Popup<input className={s.input} value={site.promoTitle ?? ''} onChange={(e) => upd({ promoTitle: e.target.value })} /></label>
          <label className={s.label} style={{ gridColumn: '1/-1' }}>Subjudul<textarea className={s.textarea} value={site.promoSubtitle ?? ''} rows={3} onChange={(e) => upd({ promoSubtitle: e.target.value })} /></label>
          <label className={s.label}>Kadaluarsa<input className={s.input} type="date" value={site.promoExpiry ? site.promoExpiry.slice(0, 10) : ''} onChange={(e) => upd({ promoExpiry: e.target.value })} /></label>
          <label className={s.label}>Path Gambar BG<input className={s.input} value={site.promoBgImage ?? ''} onChange={(e) => upd({ promoBgImage: e.target.value })} /></label>
          <label className={s.label} style={{ gridColumn: '1/-1' }}>Catatan / Syarat<input className={s.input} value={site.promoNote ?? ''} onChange={(e) => upd({ promoNote: e.target.value })} /></label>
        </div>
        <UploadField label="Upload Gambar Background Popup" onUploaded={(url) => { upd({ promoBgImage: url }); onUpload(url); }} />
        <p style={{ fontSize: '0.75rem', color: 'var(--text3)', lineHeight: 1.6, padding: '12px', background: 'var(--bg3)', borderRadius: 'var(--radius-sm)' }}>
          Popup muncul otomatis 1.5 detik setelah pengunjung membuka halaman. Data email yang diklaim tersimpan di tab Pesan Masuk dengan source &quot;promo&quot;.
        </p>
      </div>
    </div>
  );
}

// ─── Showcase Editor ──────────────────────────────────────────────
function ShowcaseEditor({ slides, onChange }: { slides: ShowcaseSlide[]; onChange: (s: ShowcaseSlide[]) => void }) {
  function update(i: number, patch: Partial<ShowcaseSlide>) {
    onChange(slides.map((sl, j) => (j === i ? { ...sl, ...patch } : sl)));
  }
  function add() {
    onChange([...slides, { id: 'sc-' + Date.now(), image: '/assets/photos/rooftop-view.png', eyebrow: 'LABEL KECIL', title: 'Judul Besar Slide', subtitle: 'Deskripsi singkat.', href: '/menu' }]);
  }
  function remove(i: number) { if (!confirm('Hapus slide ini?')) return; onChange(slides.filter((_, j) => j !== i)); }
  function moveUp(i: number) { if (i === 0) return; const n = [...slides]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; onChange(n); }
  function moveDown(i: number) { if (i === slides.length - 1) return; const n = [...slides]; [n[i], n[i + 1]] = [n[i + 1], n[i]]; onChange(n); }

  return (
    <div className={s.editorList}>
      <p style={{ fontSize: '0.8rem', color: 'var(--text3)', lineHeight: 1.6 }}>
        Slider full-width di halaman home setelah bagian Scroll Story. Tiap slide punya foto latar, judul besar, dan tombol CTA.
      </p>
      {slides.map((sl, i) => (
        <div key={sl.id} className={s.card}>
          <div className={s.cardHead}>
            <strong>Slide {i + 1} — {sl.title}</strong>
            <div style={{ display: 'flex', gap: 6 }}>
              {[{ label: '↑', action: () => moveUp(i), disabled: i === 0 }, { label: '↓', action: () => moveDown(i), disabled: i === slides.length - 1 }].map(({ label, action, disabled }) => (
                <button key={label} onClick={action} disabled={disabled}
                  style={{ padding: '4px 10px', border: '0.5px solid var(--border2)', background: 'none', color: 'var(--text3)', borderRadius: 'var(--radius-sm)', opacity: disabled ? 0.3 : 1 }}>
                  {label}
                </button>
              ))}
              <button className={s.btnDanger} onClick={() => remove(i)}>Hapus</button>
            </div>
          </div>
          <div className={s.fieldGrid}>
            <label className={s.label}>Eyebrow<input className={s.input} value={sl.eyebrow} onChange={(e) => update(i, { eyebrow: e.target.value })} /></label>
            <label className={s.label}>Harga IDR (opsional)<input className={s.input} type="number" value={sl.price ?? ''} onChange={(e) => update(i, { price: e.target.value ? +e.target.value : undefined })} /></label>
            <label className={s.label} style={{ gridColumn: '1/-1' }}>Judul Besar<input className={s.input} value={sl.title} onChange={(e) => update(i, { title: e.target.value })} /></label>
            <label className={s.label} style={{ gridColumn: '1/-1' }}>Subjudul<textarea className={s.textarea} value={sl.subtitle} rows={2} onChange={(e) => update(i, { subtitle: e.target.value })} /></label>
            <label className={s.label}>Path Foto Background<input className={s.input} value={sl.image} onChange={(e) => update(i, { image: e.target.value })} /></label>
            <label className={s.label}>Link CTA<input className={s.input} value={sl.href} onChange={(e) => update(i, { href: e.target.value })} /></label>
          </div>
          <UploadField label="Upload Foto Background Slide" onUploaded={(url) => update(i, { image: url })} />
        </div>
      ))}
      <button className={s.btnAdd} onClick={add}>+ Tambah Slide Baru</button>
    </div>
  );
}

// ─── Upload Field ─────────────────────────────────────────────────
function UploadField({ label, onUploaded }: { label: string; onUploaded: (url: string) => void }) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);
  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus('uploading');
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    onUploaded(data.url);
    setStatus('done');
    setTimeout(() => setStatus('idle'), 2000);
    if (inputRef.current) inputRef.current.value = '';
  }
  return (
    <div className={s.uploadRow}>
      <label className={s.uploadLabel}>
        <input ref={inputRef} type="file" accept="image/*" className={s.fileInput} onChange={upload} />
        {status === 'idle' && `📎 ${label}`}
        {status === 'uploading' && 'Uploading…'}
        {status === 'done' && '✓ Berhasil diupload!'}
      </label>
    </div>
  );
}

// ─── Leads Panel ──────────────────────────────────────────────────
type LeadStatus = 'new' | 'read' | 'replied' | 'done';
type LeadItem = { id: string; createdAt: string; source: string; name: string; phone?: string; email?: string; message: string; voucherCode?: string; status: LeadStatus; };
const STATUS_LABELS: Record<LeadStatus, string> = { new: 'Baru', read: 'Dibaca', replied: 'Dibalas', done: 'Selesai' };
const STATUS_COLORS: Record<LeadStatus, string> = { new: '#C9A84C', read: '#4A8EC9', replied: '#4CAF72', done: '#5E5A54' };

function LeadsPanel() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/leads').then((r) => r.json()).then((data) => { setLeads(Array.isArray(data) ? data : []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: LeadStatus) {
    await fetch('/api/leads', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  }

  const FILTERS = ['all', 'new', 'chat', 'promo', 'contact', 'gift-card', 'replied', 'done'];
  const filtered = filter === 'all' ? leads : leads.filter((l) => l.source === filter || l.status === filter);
  const newCount = leads.filter((l) => l.status === 'new').length;

  if (loading) return <div className={s.editorList} style={{ color: 'var(--text3)', textAlign: 'center', padding: '60px 0', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', letterSpacing: '0.08em' }}>Memuat pesan masuk…</div>;

  return (
    <div className={s.editorList}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--text1)' }}>{leads.length} Pesan Masuk</span>
        {newCount > 0 && <span style={{ background: 'var(--gold)', color: 'var(--bg0)', fontSize: '0.74rem', fontWeight: 500, padding: '3px 10px', borderRadius: 20, fontFamily: 'var(--font-mono)' }}>{newCount} baru</span>}
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '5px 14px', borderRadius: 20, border: filter === f ? '0.5px solid var(--gold)' : '0.5px solid var(--border2)', background: filter === f ? 'var(--gold-dim)' : 'transparent', color: filter === f ? 'var(--gold)' : 'var(--text3)', fontSize: '0.78rem', cursor: 'pointer', transition: 'all .2s', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
            {f === 'all' ? 'Semua' : f}
          </button>
        ))}
      </div>

      {filtered.length === 0 && <div style={{ color: 'var(--text3)', textAlign: 'center', padding: '48px 0', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>Belum ada pesan di kategori ini.</div>}

      {filtered.map((lead) => (
        <div key={lead.id} className={s.card} style={{ borderLeft: '2px solid ' + (STATUS_COLORS[lead.status] ?? 'var(--border2)') }}>
          <div className={s.cardHead}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <strong style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}>{lead.name}</strong>
              <span className={s.badge}>{lead.source}</span>
              {lead.voucherCode && <span className={s.badge} style={{ background: 'var(--gold-dim)', color: 'var(--gold)', borderColor: 'var(--gold-border)' }}>🎟 {lead.voucherCode}</span>}
            </div>
            <select value={lead.status} onChange={(e) => updateStatus(lead.id, e.target.value as LeadStatus)} className={s.select}
              style={{ padding: '5px 10px', fontSize: '0.8rem', borderColor: STATUS_COLORS[lead.status] ?? 'var(--border2)', minWidth: 110, maxWidth: 130 }}>
              {(Object.entries(STATUS_LABELS) as [LeadStatus, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem', lineHeight: 1.65, wordBreak: 'break-word' }}>{lead.message}</p>
          <div style={{ display: 'flex', gap: 18, fontSize: '0.71rem', color: 'var(--text3)', flexWrap: 'wrap', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
            <span>{new Date(lead.createdAt).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            {lead.email && <span>{lead.email}</span>}
            {lead.phone && <span>{lead.phone}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Analytics types ──────────────────────────────────────────────
type DaySummary = { date: string; views: number; unique: number; pages: Record<string, number> };
type AnalyticsSummary = { totalViews: number; totalUnique: number; todayViews: number; todayUnique: number; topPages: { path: string; views: number }[]; daily: DaySummary[]; devices: { desktop: number; mobile: number; tablet: number } };

// ─── Analytics Dashboard ──────────────────────────────────────────
function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState<7 | 14 | 30>(30);

  useEffect(() => {
    setLoading(true);
    fetch('/api/analytics').then((r) => { if (!r.ok) throw new Error('Unauthorized'); return r.json(); })
      .then((d) => { setData(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  if (loading) return <div style={{ padding: '80px 32px', textAlign: 'center', color: 'var(--text3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', fontSize: '0.85rem' }}>Memuat data analytics…</div>;
  if (error) return <div style={{ padding: '80px 32px', textAlign: 'center', color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>Error: {error}</div>;
  if (!data) return null;

  const days = data.daily.slice(-period);
  const maxViews = Math.max(...days.map((d) => d.views), 1);
  const totalDevices = data.devices.desktop + data.devices.mobile + data.devices.tablet || 1;

  function fmtDate(iso: string) {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  }
  function pathLabel(p: string) {
    const map: Record<string, string> = { '/': 'Beranda', '/menu': 'Menu', '/about': 'About', '/news': 'News', '/contact': 'Contact', '/gift-card': 'Gift Card' };
    return map[p] ?? p;
  }

  const STAT_CARDS = [
    { label: 'Total Kunjungan', value: data.totalViews.toLocaleString('id-ID'), sub: '30 hari terakhir', accent: 'c-gold' as const },
    { label: 'Visitor Unik',    value: data.totalUnique.toLocaleString('id-ID'), sub: '30 hari terakhir', accent: 'c-green' as const },
    { label: 'Hari Ini',       value: data.todayViews.toLocaleString('id-ID'),  sub: 'kunjungan hari ini', accent: 'c-blue' as const },
    { label: 'Unik Hari Ini',  value: data.todayUnique.toLocaleString('id-ID'), sub: 'visitor berbeda',   accent: 'c-purple' as const },
  ];

  return (
    <div className={s.analyticsPad}>

      {/* Stat cards */}
      <div className={s.statGrid}>
        {STAT_CARDS.map((c) => (
          <div key={c.label} className={`${s.statCard} ${s[c.accent]}`}>
            <div className={s.statLabel}>{c.label}</div>
            <div className={s.statValue}>{c.value}</div>
            <div className={s.statSub}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className={s.chartCard}>
        <div className={s.chartHeader}>
          <h3 className={s.chartTitle}>Kunjungan Harian</h3>
          <div className={s.periodTabs}>
            {([7, 14, 30] as const).map((p) => (
              <button key={p} onClick={() => setPeriod(p)} className={`${s.periodTab} ${period === p ? s.periodTabActive : ''}`}>{p}H</button>
            ))}
          </div>
        </div>

        <svg
          viewBox={`0 0 ${days.length * 30} 140`}
          style={{ width: '100%', minWidth: Math.max(days.length * 30, 300) + 'px', height: 140, display: 'block', overflow: 'visible' }}
          aria-label="Bar chart kunjungan harian"
          role="img"
        >
          {[0.25, 0.5, 0.75, 1].map((r) => (
            <line key={r} x1="0" y1={128 - r * 110} x2={days.length * 30} y2={128 - r * 110} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          ))}
          {days.map((d, i) => {
            const barH = Math.max(2, (d.views / maxViews) * 110);
            const uniqueH = Math.max(1, (d.unique / maxViews) * 110);
            const x = i * 30 + 3;
            const isToday = d.date === new Date().toISOString().slice(0, 10);
            return (
              <g key={d.date}>
                <rect x={x} y={128 - barH} width={14} height={barH} fill={isToday ? '#C9A84C' : '#2A2721'} rx="2">
                  <title>{d.date}: {d.views} kunjungan, {d.unique} unik</title>
                </rect>
                <rect x={x + 14} y={128 - uniqueH} width={10} height={uniqueH} fill={isToday ? 'rgba(201,168,76,0.35)' : '#1A1917'} rx="2" />
              </g>
            );
          })}
        </svg>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, paddingInline: 3 }}>
          {days.filter((_, i) => i === 0 || i === Math.floor(days.length / 2) || i === days.length - 1).map((d) => (
            <span key={d.date} style={{ fontSize: '0.65rem', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{fmtDate(d.date)}</span>
          ))}
        </div>

        <div className={s.chartLegend}>
          <div className={s.legendItem}><div className={s.legendDot} style={{ background: '#C9A84C' }} />Hari ini</div>
          <div className={s.legendItem}><div className={s.legendDot} style={{ background: '#2A2721' }} />Total kunjungan</div>
          <div className={s.legendItem}><div className={s.legendDot} style={{ background: '#1A1917', border: '0.5px solid #3A3730' }} />Visitor unik</div>
        </div>
      </div>

      {/* Bottom */}
      <div className={s.bottomGrid}>

        {/* Top Pages */}
        <div className={s.innerCard}>
          <h3 className={s.innerCardTitle}>Halaman Terpopuler</h3>
          {data.topPages.length === 0 && <p style={{ color: 'var(--text3)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>Belum ada data halaman.</p>}
          {data.topPages.map((p, i) => {
            const pct = Math.round((p.views / (data.topPages[0]?.views || 1)) * 100);
            return (
              <div key={p.path} className={s.pageRow}>
                <div className={s.pageRowLeft}>
                  <span className={s.pageNum}>{i + 1}</span>
                  <div>
                    <div className={s.pageName}>{pathLabel(p.path)}</div>
                    <div className={s.pagePath}>{p.path}</div>
                  </div>
                </div>
                <div className={s.pageRowRight}>
                  <div className={s.pageBarWrap}><div className={s.pageBar} style={{ width: pct + '%' }} /></div>
                  <div className={s.pageCount}>{p.views.toLocaleString('id-ID')}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Devices */}
        <div className={s.innerCard} style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 className={s.innerCardTitle}>Perangkat</h3>

          <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
            <svg viewBox="0 0 120 120" width="110" height="110" role="img" aria-label={`Perangkat: Desktop ${data.devices.desktop}, Mobile ${data.devices.mobile}, Tablet ${data.devices.tablet}`}>
              {(() => {
                const items = [
                  { key: 'desktop', color: '#C9A84C', val: data.devices.desktop },
                  { key: 'mobile',  color: '#4A8EC9', val: data.devices.mobile },
                  { key: 'tablet',  color: '#4CAF72', val: data.devices.tablet },
                ];
                const total = items.reduce((a, b) => a + b.val, 0) || 1;
                let offset = 0;
                const R = 44, circ = 2 * Math.PI * R;
                return items.map((item) => {
                  const dash = (item.val / total) * circ;
                  const gap = circ - dash;
                  const el = <circle key={item.key} cx="60" cy="60" r={R} fill="none" stroke={item.color} strokeWidth="18" strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-offset} transform="rotate(-90 60 60)" opacity={item.val === 0 ? 0.1 : 1} />;
                  offset += dash;
                  return el;
                });
              })()}
              <text x="60" y="55" textAnchor="middle" fill="#F0EDE6" fontSize="20" fontFamily="'Instrument Serif', serif">{totalDevices.toLocaleString('id-ID')}</text>
              <text x="60" y="69" textAnchor="middle" fill="#5E5A54" fontSize="8" fontFamily="'DM Mono', monospace" letterSpacing="0.08em">visits</text>
            </svg>
          </div>

          {[
            { label: 'Desktop', val: data.devices.desktop, color: '#C9A84C', icon: '🖥️' },
            { label: 'Mobile',  val: data.devices.mobile,  color: '#4A8EC9', icon: '📱' },
            { label: 'Tablet',  val: data.devices.tablet,  color: '#4CAF72', icon: '📟' },
          ].map((d) => (
            <div key={d.label} className={s.deviceRow}>
              <div className={s.deviceRowLeft}>
                <div className={s.deviceDot} style={{ background: d.color }} />
                {d.icon} {d.label}
              </div>
              <div>
                <span className={s.deviceVal}>{d.val.toLocaleString('id-ID')}</span>
                <span className={s.devicePct}>{Math.round((d.val / totalDevices) * 100)}%</span>
              </div>
            </div>
          ))}

          <p className={s.privacyNote}>Data dikumpulkan tanpa menyimpan informasi pribadi. IP di-hash dan tidak bisa dibalik.</p>
        </div>
      </div>
    </div>
  );
}
