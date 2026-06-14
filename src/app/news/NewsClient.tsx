'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Article } from '@/lib/content';
import styles from './news.module.css';

const CATEGORY_LABELS: Record<string, string> = {
  all: 'Semua',
  cerita: 'Cerita',
  kopi: 'Kopi',
  event: 'Event',
  tips: 'Tips',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export function NewsClient({ articles }: { articles: Article[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const featured = articles.find((a) => a.featured);
  const filtered = articles.filter(
    (a) => activeCategory === 'all' || a.category === activeCategory
  );

  return (
    <main className={styles.page}>
      {/* ── Hero banner ───────────────────────────────── */}
      <header className={`asphalt ${styles.header}`}>
        <div className="grit-overlay" aria-hidden />
        <div className={styles.watermark} aria-hidden>NEWS</div>
        <div className={`container ${styles.headerInner}`}>
          <div className="reveal">
            <span className="eyebrow">STRATA · CERITA & BERITA</span>
            <h1 className={`display ${styles.headerTitle}`}>
              Dari rooftop<br />
              <span className={styles.accent}>ke halaman.</span>
            </h1>
            <p className={styles.headerLead}>
              Kopi, cerita di balik cangkir, dan hal-hal kecil yang terjadi di 720m ketinggian.
            </p>
          </div>
        </div>
      </header>

      {/* ── Featured article ──────────────────────────── */}
      {featured && (
        <section className={`container ${styles.featuredWrap}`}>
          <Link href={`/news/${featured.slug}`} className={styles.featured}>
            <div className={styles.featuredImg}>
              <Image
                src={featured.coverImage}
                alt={featured.title}
                fill
                sizes="(max-width: 900px) 100vw, 55vw"
                className={styles.featuredImgEl}
                priority
              />
              <div className={styles.featuredImgOverlay} />
            </div>
            <div className={styles.featuredBody}>
              <div className={styles.featuredMeta}>
                <span className={`${styles.catBadge} ${styles[`cat_${featured.category}`]}`}>
                  {CATEGORY_LABELS[featured.category]}
                </span>
                <span className={`mono ${styles.metaText}`}>{formatDate(featured.publishedAt)}</span>
                <span className={`mono ${styles.metaText}`}>{featured.readingTime} mnt baca</span>
              </div>
              <h2 className={`display ${styles.featuredTitle}`}>{featured.title}</h2>
              <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
              <span className={styles.readMore}>
                Baca selengkapnya
                <span className="arrow" aria-hidden> →</span>
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* ── Category filter ───────────────────────────── */}
      <div className={`container ${styles.filterWrap}`}>
        <div className={styles.filter}>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              className={`${styles.filterBtn} ${activeCategory === key ? styles.filterActive : ''}`}
              onClick={() => setActiveCategory(key)}
            >
              {label}
              <span className={styles.filterCount}>
                {key === 'all' ? articles.length : articles.filter((a) => a.category === key).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Article grid ──────────────────────────────── */}
      <section className={`container ${styles.grid}`}>
        {filtered.length === 0 && (
          <div className={styles.empty}>
            <span>Belum ada artikel di kategori ini.</span>
          </div>
        )}
        {filtered.map((article, i) => (
          <Link
            key={article.id}
            href={`/news/${article.slug}`}
            className={`${styles.card} reveal`}
            style={{ transitionDelay: `${i * 0.06}s` }}
          >
            <div className={styles.cardImg}>
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={styles.cardImgEl}
              />
              <div className={styles.cardImgOverlay} />
              <span className={`${styles.catBadge} ${styles[`cat_${article.category}`]} ${styles.catBadgeAbsolute}`}>
                {CATEGORY_LABELS[article.category]}
              </span>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardMeta}>
                <span className={`mono ${styles.metaText}`}>{formatDate(article.publishedAt)}</span>
                <span className={`mono ${styles.metaText}`}>{article.readingTime} mnt</span>
              </div>
              <h3 className={`display ${styles.cardTitle}`}>{article.title}</h3>
              <p className={styles.cardExcerpt}>{article.excerpt}</p>
              <div className={styles.cardFooter}>
                <span className={`mono ${styles.author}`}>{article.author}</span>
                <span className={styles.readMoreSmall}>Baca →</span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <div className="marking" aria-hidden />
    </main>
  );
}
