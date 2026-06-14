'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Hero.module.css';
import type { HeroSlide } from '@/lib/content';

const AUTOPLAY_MS = 6000;

const formatPrice = (idr: number) => 'IDR ' + idr.toLocaleString('id-ID');

export function Hero({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const safeSlides = slides.length > 0 ? slides : [];

  useEffect(() => {
    if (safeSlides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % safeSlides.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [safeSlides.length]);

  const restartAutoplay = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (safeSlides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % safeSlides.length);
    }, AUTOPLAY_MS);
  };

  const goTo = (i: number) => {
    setActive(((i % safeSlides.length) + safeSlides.length) % safeSlides.length);
    restartAutoplay();
  };

  if (safeSlides.length === 0) return null;
  const slide = safeSlides[active];

  return (
    <section className={`asphalt ${styles.hero}`} id="top">
      <div className="grit-overlay" aria-hidden />

      {/* Watermark "S" raksasa di background */}
      <div className={styles.watermark} aria-hidden>
        S
      </div>

      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <div key={`eyebrow-${slide.id}`} className={`eyebrow ${styles.eyebrow} ${styles.fadeItem}`}>
            <span>{slide.eyebrow}</span>
          </div>

          <h1 className={`display ${styles.title}`} key={`title-${slide.id}`}>
            {slide.titleLines.map((line, i) => (
              <span
                key={i}
                className={`${styles.line} ${styles.fadeItem} ${
                  i === slide.titleLines.length - 1 ? styles.lineAccent : ''
                }`}
                style={{ animationDelay: `${0.06 + i * 0.07}s` }}
              >
                {line}
              </span>
            ))}
          </h1>

          <p
            key={`sub-${slide.id}`}
            className={`${styles.lead} ${styles.fadeItem}`}
            style={{ animationDelay: '0.22s' }}
          >
            {slide.subtitle}
          </p>

          <div key={`actions-${slide.id}`} className={`${styles.actions} ${styles.fadeItem}`} style={{ animationDelay: '0.3s' }}>
            <Link href={slide.ctaHref} className="btn is-marking">
              {slide.ctaLabel}
              <span className="arrow" aria-hidden>→</span>
            </Link>
            <Link href="/about" className={styles.secondary}>
              <span className={styles.secondaryDot} aria-hidden />
              Cerita Strata
            </Link>
          </div>

          <dl className={`reveal ${styles.stats}`}>
            <div>
              <dt>EST.</dt>
              <dd>2026</dd>
            </div>
            <div>
              <dt>ALT.</dt>
              <dd>720<span className={styles.unit}>m</span></dd>
            </div>
            <div>
              <dt>BEANS</dt>
              <dd>Indo.</dd>
            </div>
            <div>
              <dt>VIEW</dt>
              <dd>Mt. Ungaran</dd>
            </div>
          </dl>
        </div>

        {/* Slider produk */}
        <div className={styles.visual}>
          <div className={styles.visualFrame}>
            <div className={styles.blobGlow} aria-hidden />
            {safeSlides.map((s, i) => (
              <div
                key={s.id}
                className={`${styles.slide} ${i === active ? styles.slideActive : ''}`}
                aria-hidden={i !== active}
              >
                <Image
                  src={s.image}
                  alt={s.productName}
                  fill
                  sizes="(max-width: 980px) 80vw, 560px"
                  priority={i === 0}
                  className={styles.slideImg}
                />
              </div>
            ))}
          </div>

          <div key={`label-${slide.id}`} className={`${styles.productLabel} ${styles.fadeItem}`}>
            <span className={`mono ${styles.productPrice}`}>{formatPrice(slide.productPrice)}</span>
            <strong className={styles.productName}>{slide.productName}</strong>
          </div>

          {safeSlides.length > 1 && (
            <div className={styles.dots} role="tablist" aria-label="Pilih produk">
              {safeSlides.map((s, i) => (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={i === active}
                  aria-label={s.productName}
                  className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          )}

          {/* Label vertikal kanan — typografi marka jalan */}
          <div className={styles.sideLabel} aria-hidden>
            <span className="mono">
              {String(active + 1).padStart(2, '0')} / {String(safeSlides.length).padStart(2, '0')}
            </span>
            <span>·</span>
            <span>COFFEE WITH A VIEW</span>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className={styles.scrollCue} aria-hidden>
        <span className="mono">SCROLL</span>
        <span className={styles.scrollCueLine} />
      </div>
    </section>
  );
}
