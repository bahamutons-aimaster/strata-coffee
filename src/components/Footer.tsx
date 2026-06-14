import Link from 'next/link';
import { Logo } from './Logo';
import styles from './Footer.module.css';
import type { SiteInfo } from '@/lib/content';

export function Footer({ site }: { site: SiteInfo }) {
  return (
    <footer className={`asphalt ${styles.footer}`}>
      <div className="grit-overlay" aria-hidden />

      <div className={styles.giant}>
        <span>STRATA</span>
        <span className={styles.giantSub}>·COFFEE·</span>
      </div>

      <div className={`container ${styles.inner}`}>
        <div className={styles.col}>
          <Logo size={48} color="#f5b915" />
          <p className={styles.tagline}>
            Coffee with a view.<br />
            Setiap cangkir punya lapisannya sendiri.
          </p>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>VISIT</h4>
          <p className={styles.colBody}>
            <a href={site.mapsUrl} target="_blank" rel="noopener">
              {site.address}
            </a>
          </p>
          <p className={styles.mono}>
            {site.lat}<br />{site.lng} · {site.altitude}
          </p>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>HOURS</h4>
          <ul className={styles.hours}>
            <li><span>Mon–Thu</span><span className={styles.mono}>{site.hoursWeekday}</span></li>
            <li><span>Fri</span><span className={styles.mono}>{site.hoursFriday}</span></li>
            <li><span>Sat–Sun</span><span className={styles.mono}>{site.hoursWeekend}</span></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>EXPLORE</h4>
          <ul className={styles.socials}>
            <li><a href="/menu">Menu</a></li>
            <li><a href="/news">News &amp; Stories</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/gift-card">Gift Card</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>SOCIALS</h4>
          <ul className={styles.socials}>
            <li><a href={site.instagram} target="_blank" rel="noopener">Instagram <span aria-hidden>↗</span></a></li>
            <li><a href={site.tiktok} target="_blank" rel="noopener">TikTok <span aria-hidden>↗</span></a></li>
            <li><a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener">WhatsApp <span aria-hidden>↗</span></a></li>
            <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
          </ul>
        </div>
      </div>

      <div className="marking" aria-hidden />

      <div className={`container ${styles.bottom}`}>
        <span className={styles.mono}>© {new Date().getFullYear()} STRATA COFFEE</span>
        <span className={styles.mono}>Built on basalt &amp; basalt only.</span>
        <ul className={styles.legal}>
          <li><Link href="/news">News</Link></li>
          <li><Link href="/contact">Contact</Link></li>
          <li><a href="#top">Back to top ↑</a></li>
        </ul>
      </div>
    </footer>
  );
}
