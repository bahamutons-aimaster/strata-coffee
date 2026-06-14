'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { SiteInfo } from '@/lib/content';
import s from './PromoPopup.module.css';

const SESSION_KEY = 'strata_promo_seen';

function formatExpiry(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
}

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    function calc() {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
      const s = Math.floor(diff / 1000);
      setTimeLeft({ d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 });
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

export function PromoPopup({ site }: { site: SiteInfo }) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [claimed, setClaimed] = useState(false);
  const [sending, setSending] = useState(false);
  const countdown = useCountdown(site.promoExpiry);

  // Muncul 1.5 detik setelah load, hanya sekali per sesi
  useEffect(() => {
    if (!site.promoEnabled) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, [site.promoEnabled]);

  function close() {
    setVisible(false);
    sessionStorage.setItem(SESSION_KEY, '1');
  }

  function copyCode() {
    navigator.clipboard.writeText(site.promoCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  async function claimVoucher(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'promo',
          name: 'Klaim Promo',
          email,
          message: `Klaim voucher promo: ${site.promoCode}`,
          voucherCode: site.promoCode,
        }),
      });
      setClaimed(true);
    } catch {
      // Tetap tampilkan sukses meski gagal simpan
      setClaimed(true);
    } finally {
      setSending(false);
    }
  }

  if (!site.promoEnabled) return null;

  return (
    <div
      className={`${s.overlay} ${visible ? s.overlayVisible : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Promo spesial Strata Coffee"
    >
      <div className={`${s.modal} ${visible ? s.modalVisible : ''}`}>
        {/* Close button */}
        <button className={s.closeBtn} onClick={close} aria-label="Tutup promo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Left — gambar background */}
        <div className={s.imgSide}>
          <Image
            src={site.promoBgImage || '/assets/photos/rooftop-view.png'}
            alt="Strata Coffee Promo"
            fill
            sizes="420px"
            className={s.bgImg}
            priority
          />
          <div className={s.imgOverlay} />
          {/* Badge */}
          <div className={s.badge}>{site.promoBadge}</div>
          {/* Countdown */}
          <div className={s.countdown}>
            <p className={s.countdownLabel}>Berakhir dalam</p>
            <div className={s.countdownRow}>
              {[
                { val: countdown.d, label: 'Hari' },
                { val: countdown.h, label: 'Jam' },
                { val: countdown.m, label: 'Menit' },
                { val: countdown.s, label: 'Detik' },
              ].map(({ val, label }) => (
                <div key={label} className={s.countdownUnit}>
                  <span className={s.countdownNum}>{String(val).padStart(2, '0')}</span>
                  <span className={s.countdownUnitLabel}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — konten */}
        <div className={s.content}>
          {!claimed ? (
            <>
              <div className={s.topTag}>HANYA UNTUK KAMU</div>
              <h2 className={s.title}>{site.promoTitle}</h2>
              <p className={s.subtitle}>{site.promoSubtitle}</p>

              {/* Kode voucher */}
              <div className={s.codeWrap}>
                <span className={s.codeLabel}>Kode Voucher</span>
                <button className={s.codeBox} onClick={copyCode} title="Klik untuk menyalin">
                  <span className={s.code}>{site.promoCode}</span>
                  <span className={s.copyHint}>
                    {copied ? (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16"><path d="M20 6L9 17l-5-5"/></svg>
                        Disalin!
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16">
                          <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                        </svg>
                        Salin kode
                      </>
                    )}
                  </span>
                </button>
              </div>

              {/* Form klaim — opsional email */}
              <form onSubmit={claimVoucher} className={s.form}>
                <input
                  type="email"
                  className={s.emailInput}
                  placeholder="Email kamu (opsional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className={s.claimBtn} disabled={sending}>
                  {sending ? 'Mengklaim...' : 'Klaim Voucher →'}
                </button>
              </form>

              <p className={s.expiry}>Berlaku hingga {formatExpiry(site.promoExpiry)}</p>
              <p className={s.note}>{site.promoNote}</p>
            </>
          ) : (
            /* Sukses state */
            <div className={s.success}>
              <div className={s.successIcon}>☕</div>
              <h3 className={s.successTitle}>Voucher Diklaim!</h3>
              <p className={s.successSub}>
                Tunjukkan kode <strong>{site.promoCode}</strong> ke kasir saat berkunjung.
                {email && ' Konfirmasi juga dikirim ke emailmu.'}
              </p>
              <button className={s.claimBtn} onClick={close}>Tutup &amp; Explore →</button>
            </div>
          )}

          <button className={s.skipBtn} onClick={close}>Tidak, terima kasih</button>
        </div>
      </div>
    </div>
  );
}
