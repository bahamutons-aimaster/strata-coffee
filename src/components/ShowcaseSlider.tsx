'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ShowcaseSlide } from '@/lib/content';
import s from './ShowcaseSlider.module.css';

const AUTOPLAY_MS = 5500;
const TRANSITION_MS = 900;

const formatIDR = (n: number) => 'IDR ' + n.toLocaleString('id-ID');

export function ShowcaseSlider({ slides }: { slides: ShowcaseSlide[] }) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const n = slides.length;

  const goTo = useCallback(
    (idx: number, manual = false) => {
      if (transitioning) return;
      const next = ((idx % n) + n) % n;
      if (next === current) return;
      setPrev(current);
      setCurrent(next);
      setTransitioning(true);
      setTimeout(() => { setPrev(null); setTransitioning(false); }, TRANSITION_MS);
      if (manual) {
        clearInterval(timerRef.current!);
        if (!paused) startTimer();
      }
    },
    [current, transitioning, n, paused]
  );

  function startTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      goTo((current + 1) % n);
    }, AUTOPLAY_MS);
  }

  // Auto-play
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setCurrent((c) => {
        const next = (c + 1) % n;
        setPrev(c);
        setTransitioning(true);
        setTimeout(() => { setPrev(null); setTransitioning(false); }, TRANSITION_MS);
        return next;
      });
    }, AUTOPLAY_MS);
    return () => clearInterval(timerRef.current!);
  }, [n, paused]);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goTo(current - 1, true);
      if (e.key === 'ArrowRight') goTo(current + 1, true);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [current, goTo]);

  // Touch/swipe handlers
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Hanya proses swipe horizontal (bukan vertical scroll)
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      goTo(dx < 0 ? current + 1 : current - 1, true);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  }

  if (!slides.length) return null;

  const slide = slides[current];

  return (
    <section
      className={s.section}
      id="menu-preview"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Showcase slider"
    >
      {/* Slides — crossfade */}
      <div className={s.track}>
        {/* Previous slide (fading out) */}
        {prev !== null && (
          <div className={`${s.slide} ${s.slideOut}`} aria-hidden>
            <Image
              src={slides[prev].image}
              alt={slides[prev].title}
              fill
              sizes="100vw"
              className={s.img}
              priority={false}
            />
            <div className={s.overlay} />
          </div>
        )}

        {/* Current slide (fading in) */}
        <div className={`${s.slide} ${s.slideIn}`} key={slide.id}>
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            sizes="100vw"
            className={s.img}
            priority={current === 0}
          />
          <div className={s.overlay} />
        </div>

        {/* Grit texture */}
        <div className={s.grit} aria-hidden />
      </div>

      {/* Content */}
      <div className={`container ${s.content}`}>
        <div className={s.copy} key={`copy-${current}`}>
          <span className={`${s.eyebrow} mono`}>{slide.eyebrow}</span>
          <h2 className={`display ${s.title}`}>{slide.title}</h2>
          <p className={s.subtitle}>{slide.subtitle}</p>

          <div className={s.actions}>
            <Link href={slide.href} className={s.cta}>
              {slide.price ? `Pesan Sekarang` : `Lihat Selengkapnya`}
              <span className={s.arrow}>→</span>
            </Link>
            {slide.price && (
              <span className={s.price}>{formatIDR(slide.price)}</span>
            )}
          </div>
        </div>

        {/* Counter */}
        <div className={`mono ${s.counter}`}>
          <span className={s.counterCurrent}>{String(current + 1).padStart(2, '0')}</span>
          <span className={s.counterSep}>/</span>
          <span className={s.counterTotal}>{String(n).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Arrows */}
      <button
        className={`${s.arrow_btn} ${s.arrow_prev}`}
        onClick={() => goTo(current - 1, true)}
        aria-label="Slide sebelumnya"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        className={`${s.arrow_btn} ${s.arrow_next}`}
        onClick={() => goTo(current + 1, true)}
        aria-label="Slide berikutnya"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Progress bar dots */}
      <div className={s.dots} role="tablist" aria-label="Pilih slide">
        {slides.map((sl, i) => (
          <button
            key={sl.id}
            role="tab"
            aria-selected={i === current}
            aria-label={sl.title}
            className={s.dot}
            onClick={() => goTo(i, true)}
          >
            <span
              className={s.dotFill}
              style={{
                animationDuration: `${AUTOPLAY_MS}ms`,
                animationPlayState: i === current && !paused ? 'running' : 'paused',
                width: i === current ? undefined : i < current ? '100%' : '0%',
              }}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
