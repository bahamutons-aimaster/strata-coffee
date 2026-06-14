import Image from 'next/image';
import Link from 'next/link';
import styles from './VisitBlock.module.css';
import type { SiteInfo } from '@/lib/content';

export function VisitBlock({ site }: { site: SiteInfo }) {
  const waDisplay = site.whatsapp.replace(/^62/, '0').replace(/(\d{3,4})(?=\d)/, '$1 ');

  return (
    <section className={`asphalt ${styles.visit}`} id="visit">
      <div className="grit-overlay" aria-hidden />

      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <span className="eyebrow">CHAPTER 03 · COME UP HERE</span>
          <h2 className={`display ${styles.title}`}>
            Naik sedikit.
            <br />
            <span className={styles.titleYellow}>Kopinya menunggu.</span>
          </h2>
          <p className={styles.lead}>
            Strata Coffee duduk di ketinggian {site.altitude}, dipeluk lereng Ungaran
            di selatan dan dataran Bandungan di utara. Jalan ke sini sedikit
            menanjak — tapi setiap meter dibayar tunai oleh pemandangannya.
          </p>

          <dl className={styles.info}>
            <div className={styles.infoRow}>
              <dt className="mono">ALAMAT</dt>
              <dd>{site.address}</dd>
            </div>
            <div className={styles.infoRow}>
              <dt className="mono">JAM BUKA</dt>
              <dd>
                Sen–Kam · {site.hoursWeekday}<br />
                Jum · {site.hoursFriday}<br />
                Sab–Min · {site.hoursWeekend}
              </dd>
            </div>
            <div className={styles.infoRow}>
              <dt className="mono">RESERVASI</dt>
              <dd>WhatsApp · {waDisplay}</dd>
            </div>
          </dl>

          <div className={styles.actions}>
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn is-marking"
            >
              Buka di Maps
              <span className="arrow" aria-hidden>→</span>
            </a>
            <Link href="/contact" className={styles.secondary}>
              <span className={styles.secondaryDot} aria-hidden />
              Kontak lengkap
            </Link>
          </div>
        </div>

        <div className={styles.visual}>
          {/* Koordinat besar */}
          <div className={styles.coords}>
            <span className={`display ${styles.coord}`}>
              <span className="mono">LAT.</span> {site.lat}
            </span>
            <span className={`display ${styles.coord}`}>
              <span className="mono">LNG.</span> {site.lng}
            </span>
            <span className={`display ${styles.coord}`}>
              <span className="mono">ALT.</span> {site.altitude}
            </span>
          </div>

          <div className={styles.photo}>
            <Image
              src="/assets/photos/team-welcome.png"
              alt="Tim Strata Coffee menyambut tamu"
              width={1200}
              height={1200}
              className={styles.photoImg}
            />
            <div className={styles.photoLabel}>
              <span className="mono">CHAPTER 03 · CREW</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
