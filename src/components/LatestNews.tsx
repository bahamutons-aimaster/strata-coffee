import Image from 'next/image';
import Link from 'next/link';
import type { Article } from '@/lib/content';
import styles from './LatestNews.module.css';

const CATEGORY_LABELS: Record<string, string> = {
  cerita: 'Cerita', kopi: 'Kopi', event: 'Event', tips: 'Tips',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function LatestNews({ articles }: { articles: Article[] }) {
  const latest = articles
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  if (!latest.length) return null;

  const [primary, ...rest] = latest;

  return (
    <section className={`asphalt-light ${styles.section}`} id="news">
      <div className={`container ${styles.head}`}>
        <div>
          <span className="eyebrow">CERITA TERBARU</span>
          <h2 className={`display ${styles.title}`}>
            Dari rooftop<br />
            <span className={styles.accent}>ke halaman.</span>
          </h2>
        </div>
        <Link href="/news" className={styles.allLink}>
          Semua artikel
          <span className="arrow" aria-hidden> →</span>
        </Link>
      </div>

      <div className="marking" aria-hidden />

      <div className={`container ${styles.grid}`}>
        {/* Featured/primary card — big */}
        <Link href={`/news/${primary.slug}`} className={`${styles.primary} reveal`}>
          <div className={styles.primaryImg}>
            <Image
              src={primary.coverImage}
              alt={primary.title}
              fill
              sizes="(max-width: 900px) 100vw, 55vw"
              className={styles.primaryImgEl}
            />
            <div className={styles.primaryOverlay} />
            <span className={`${styles.catBadge} ${styles[`cat_${primary.category}`]}`}>
              {CATEGORY_LABELS[primary.category]}
            </span>
          </div>
          <div className={styles.primaryBody}>
            <span className={`mono ${styles.date}`}>{formatDate(primary.publishedAt)}</span>
            <h3 className={`display ${styles.primaryTitle}`}>{primary.title}</h3>
            <p className={styles.primaryExcerpt}>{primary.excerpt}</p>
            <span className={styles.readMore}>Baca →</span>
          </div>
        </Link>

        {/* Side cards */}
        <div className={styles.side}>
          {rest.map((a, i) => (
            <Link key={a.id} href={`/news/${a.slug}`} className={`${styles.sideCard} reveal`} style={{ transitionDelay: `${(i + 1) * 0.1}s` }}>
              <div className={styles.sideImg}>
                <Image
                  src={a.coverImage}
                  alt={a.title}
                  fill
                  sizes="180px"
                  className={styles.sideImgEl}
                />
              </div>
              <div className={styles.sideBody}>
                <div className={styles.sideMeta}>
                  <span className={`${styles.catBadge} ${styles[`cat_${a.category}`]}`}>{CATEGORY_LABELS[a.category]}</span>
                  <span className={`mono ${styles.date}`}>{formatDate(a.publishedAt)}</span>
                </div>
                <h3 className={`display ${styles.sideTitle}`}>{a.title}</h3>
                <p className={styles.sideExcerpt}>{a.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
