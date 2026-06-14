'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Article } from '@/lib/content';
import styles from './article.module.css';

const CATEGORY_LABELS: Record<string, string> = {
  cerita: 'Cerita', kopi: 'Kopi', event: 'Event', tips: 'Tips',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

/** Render markdown sederhana ke HTML: ##, **bold**, *italic*, paragraf kosong */
function renderMarkdown(text: string): string {
  return text
    .split('\n\n')
    .map((para) => {
      const trimmed = para.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('## ')) {
        return `<h2>${trimmed.slice(3)}</h2>`;
      }
      if (trimmed.startsWith('# ')) {
        return `<h1>${trimmed.slice(2)}</h1>`;
      }
      const lines = trimmed
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .split('\n')
        .join('<br/>');
      return `<p>${lines}</p>`;
    })
    .join('\n');
}

export function ArticleClient({
  article,
  related,
}: {
  article: Article;
  related: Article[];
}) {
  const [shareMsg, setShareMsg] = useState('');

  useEffect(() => {
    // Scroll progress untuk artikel
    const update = () => {
      const el = document.querySelector('[data-article-body]') as HTMLElement;
      if (!el) return;
      const { top, bottom } = el.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -top / (bottom - top - window.innerHeight)));
      document.documentElement.style.setProperty('--article-progress', `${progress}`);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  function share() {
    if (navigator.share) {
      navigator.share({ title: article.title, text: article.excerpt, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareMsg('Link disalin!');
      setTimeout(() => setShareMsg(''), 2000);
    }
  }

  const html = renderMarkdown(article.content);

  return (
    <main className={styles.page}>
      {/* Article read progress bar */}
      <div className={styles.readProgress} aria-hidden />

      {/* Cover image header */}
      <header className={styles.header}>
        <div className={styles.coverWrap}>
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            sizes="100vw"
            className={styles.coverImg}
            priority
          />
          <div className={styles.coverOverlay} />
        </div>

        <div className={`container ${styles.headerContent}`}>
          {/* Breadcrumb */}
          <nav className={`mono ${styles.breadcrumb}`}>
            <Link href="/">Home</Link>
            <span aria-hidden>·</span>
            <Link href="/news">News</Link>
            <span aria-hidden>·</span>
            <span className={`${styles.catBadge} ${styles[`cat_${article.category}`]}`}>
              {CATEGORY_LABELS[article.category]}
            </span>
          </nav>

          <h1 className={`display ${styles.title}`}>{article.title}</h1>

          <div className={styles.headerMeta}>
            <span className={`mono ${styles.metaItem}`}>{formatDate(article.publishedAt)}</span>
            <span className={styles.metaDot} aria-hidden>·</span>
            <span className={`mono ${styles.metaItem}`}>{article.readingTime} menit baca</span>
            <span className={styles.metaDot} aria-hidden>·</span>
            <span className={`mono ${styles.metaItem}`}>oleh {article.author}</span>
          </div>
        </div>
      </header>

      {/* Article body */}
      <div className={`container ${styles.layout}`}>
        {/* Main content */}
        <article className={styles.body} data-article-body>
          <p className={styles.lead}>{article.excerpt}</p>
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sideCard}>
            <h3 className={`mono ${styles.sideTitle}`}>TENTANG ARTIKEL</h3>
            <dl className={styles.sideDl}>
              <dt>Kategori</dt>
              <dd>
                <span className={`${styles.catBadge} ${styles[`cat_${article.category}`]}`}>
                  {CATEGORY_LABELS[article.category]}
                </span>
              </dd>
              <dt>Penulis</dt>
              <dd>{article.author}</dd>
              <dt>Diterbitkan</dt>
              <dd>{formatDate(article.publishedAt)}</dd>
              <dt>Estimasi baca</dt>
              <dd>{article.readingTime} menit</dd>
            </dl>

            <button className={styles.shareBtn} onClick={share}>
              {shareMsg || '↗ Bagikan artikel ini'}
            </button>
          </div>

          <div className={`${styles.sideCard} ${styles.sideNavCard}`}>
            <Link href="/news" className={styles.backLink}>
              ← Kembali ke semua artikel
            </Link>
            <Link href="/menu" className={styles.ctaLink}>
              Lihat Menu Strata →
            </Link>
          </div>
        </aside>
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <section className={`asphalt-light ${styles.related}`}>
          <div className="marking" aria-hidden />
          <div className={`container ${styles.relatedInner}`}>
            <h2 className={`display ${styles.relatedTitle}`}>
              Artikel lainnya
            </h2>
            <div className={styles.relatedGrid}>
              {related.map((a) => (
                <Link key={a.id} href={`/news/${a.slug}`} className={styles.relatedCard}>
                  <div className={styles.relatedImg}>
                    <Image
                      src={a.coverImage}
                      alt={a.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className={styles.relatedImgEl}
                    />
                  </div>
                  <div className={styles.relatedBody}>
                    <span className={`${styles.catBadge} ${styles[`cat_${a.category}`]}`}>
                      {CATEGORY_LABELS[a.category]}
                    </span>
                    <h3 className={styles.relatedCardTitle}>{a.title}</h3>
                    <span className={`mono ${styles.metaItem}`}>{formatDate(a.publishedAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="marking" aria-hidden />
    </main>
  );
}
