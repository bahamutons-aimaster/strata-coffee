'use client';

import { useEffect, useRef, useState } from 'react';
import sl from './strata-login.module.css';

const BG_PHOTOS = [
  '/assets/photos/customers-mountain.png',
  '/assets/photos/exterior-soft-opening.png',
  '/assets/photos/team-welcome.png',
  '/assets/photos/rooftop-view.png',
  '/assets/photos/anniversary-night.png',
];

// Komponen terpisah agar key prop trigger remount → kenburns restart tiap gambar baru
function BgSlide({ src, cls }: { src: string; cls: string }) {
  return (
    <div
      className={cls}
      style={{ backgroundImage: `url(${src})` }}
      aria-hidden
    />
  );
}

// Durasi setiap fase dalam ms
const FADE_OUT_MS = 700;  // overlay gelap muncul
const HOLD_MS     = 100;  // jeda sebentar di kegelapan (gambar berganti di sini)
const FADE_IN_MS  = 900;  // overlay gelap menghilang

export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [pw, setPw]           = useState('');
  const [err, setErr]         = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  const [bgIdx, setBgIdx]       = useState(0);
  // 0 = transparan, 1 = gelap penuh
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [transitioning, setTransitioning]   = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearTimers() {
    if (timerRef.current) clearTimeout(timerRef.current);
  }

  function goTo(nextIdx: number) {
    if (nextIdx === bgIdx || transitioning) return;
    runTransition(nextIdx);
  }

  function runTransition(nextIdx: number) {
    setTransitioning(true);

    // Fase 1: fade to dark
    setOverlayOpacity(1);

    timerRef.current = setTimeout(() => {
      // Fase 2: ganti gambar saat layar gelap
      setBgIdx(nextIdx);

      timerRef.current = setTimeout(() => {
        // Fase 3: fade back in
        setOverlayOpacity(0);

        timerRef.current = setTimeout(() => {
          setTransitioning(false);
        }, FADE_IN_MS);
      }, HOLD_MS);
    }, FADE_OUT_MS);
  }

  // Auto-rotate setiap 5 detik
  useEffect(() => {
    const id = setInterval(() => {
      setBgIdx((cur) => {
        const next = (cur + 1) % BG_PHOTOS.length;
        // Jalankan transisi via functional update
        runTransitionFromInterval(next);
        return cur; // tahan dulu, biarkan runTransition yang set
      });
    }, 5000);
    return () => { clearInterval(id); clearTimers(); };
  }, []);

  // Ref untuk akses state terbaru di dalam interval
  const transitioningRef = useRef(false);
  useEffect(() => { transitioningRef.current = transitioning; }, [transitioning]);
  const bgIdxRef = useRef(0);
  useEffect(() => { bgIdxRef.current = bgIdx; }, [bgIdx]);

  function runTransitionFromInterval(nextIdx: number) {
    if (transitioningRef.current) return;
    setTransitioning(true);
    setOverlayOpacity(1);
    timerRef.current = setTimeout(() => {
      setBgIdx(nextIdx);
      timerRef.current = setTimeout(() => {
        setOverlayOpacity(0);
        timerRef.current = setTimeout(() => {
          setTransitioning(false);
        }, FADE_IN_MS);
      }, HOLD_MS);
    }, FADE_OUT_MS);
  }

  // Reset auto-rotate setelah manual goTo agar tidak langsung loncat lagi
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  function resetInterval() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const next = (bgIdxRef.current + 1) % BG_PHOTOS.length;
      runTransitionFromInterval(next);
    }, 5000);
  }

  useEffect(() => {
    resetInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearTimers();
    };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!pw) { setErr('Masukkan password'); return; }
    setLoading(true);
    setErr('');
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    });
    setLoading(false);
    if (res.ok) onSuccess();
    else setErr('Password salah. Coba lagi.');
  }

  return (
    <div className={sl.loginPage}>

      {/* key={bgIdx} pada komponen → remount tiap ganti gambar → kenburns restart */}
      <BgSlide key={bgIdx} src={BG_PHOTOS[bgIdx]} cls={sl.bgSlide} />

      {/* Overlay hitam — fade in/out mengontrol transisi */}
      <div
        className={sl.bgOverlay}
        style={{
          opacity: overlayOpacity,
          transition: overlayOpacity === 1
            ? `opacity ${FADE_OUT_MS}ms ease-in`
            : `opacity ${FADE_IN_MS}ms ease-out`,
        }}
        aria-hidden
      />

      <form className={sl.card} onSubmit={submit}>
        <img src="/assets/logo-strata.png" className={sl.logo} alt="Strata Coffee" />

        <div className={sl.inputWrap}>
          <input
            type={showPw ? 'text' : 'password'}
            className={sl.input}
            placeholder="Password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoFocus
            autoComplete="current-password"
          />
          <button
            type="button"
            className={sl.eye}
            onClick={() => setShowPw((v) => !v)}
            aria-label={showPw ? 'Sembunyikan password' : 'Tampilkan password'}
          >
            {showPw ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>

        {err && <div className={sl.errMsg}>{err}</div>}

        <button
          type="submit"
          className={`${sl.btn}${err ? ' ' + sl.btnError : ''}`}
          disabled={loading}
        >
          {loading ? 'Memproses...' : 'Masuk'}
        </button>

        <p className={sl.footNote}>Hanya untuk tim internal Strata Coffee</p>
      </form>

      <div className={sl.dots}>
        {BG_PHOTOS.map((_, i) => (
          <button
            key={i}
            className={`${sl.dot}${i === bgIdx ? ' ' + sl.dotActive : ''}`}
            onClick={() => { goTo(i); resetInterval(); }}
            aria-label={`Foto ${i + 1}`}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}
