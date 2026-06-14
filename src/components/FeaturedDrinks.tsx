import Image from 'next/image';
import Link from 'next/link';
import styles from './FeaturedDrinks.module.css';
import type { Drink } from '@/lib/content';

const formatPrice = (idr: number) => 'IDR ' + idr.toLocaleString('id-ID');

export function FeaturedDrinks({ drinks }: { drinks: Drink[] }) {
  // Tampilkan yg ada gambar, max 4
  const featured = drinks.filter((d) => !!d.image).slice(0, 4);
  // Kalau tidak ada gambar sama sekali, tampil swatch warna
  const toShow = featured.length > 0 ? featured : drinks.slice(0, 4);

  if (!toShow.length) return null;

  return (
    <section className={`asphalt-light ${styles.section}`} id="menu-preview">
      <div className={`container ${styles.head}`}>
        <div className="reveal">
          <span className="eyebrow">WHAT WE POUR</span>
          <h2 className={`display ${styles.title}`}>
            Menu pilihan<br />
            <span className={styles.titleAccent}>yang kami banggakan.</span>
          </h2>
        </div>
        <p className={`reveal ${styles.lead}`}>
          Setiap minuman dirancang berlapis — bukan untuk gaya, tapi karena rasa
          memang datang berurutan.
        </p>
      </div>

      <div className="marking" aria-hidden />

      <div className={`container ${styles.grid}`}>
        {toShow.map((d, i) => (
          <Link
            key={d.id}
            href={`/menu#${d.id}`}
            className={`${styles.card} reveal`}
            style={{ transitionDelay: `${i * 0.07}s` }}
          >
            <span className={`mono ${styles.cardIdx}`}>
              {String(i + 1).padStart(2, '0')}
            </span>

            {d.image ? (
              <div className={styles.cardImg}>
                <Image
                  src={d.image}
                  alt={d.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className={styles.cardImgInner}
                />
                <div className={styles.cardImgOverlay} />
              </div>
            ) : (
              /* Swatch warna kalau belum ada foto */
              <div
                className={styles.cardSwatch}
                style={{
                  background: `linear-gradient(160deg, ${d.colors.top}, ${d.colors.middle} 55%, ${d.colors.bottom})`,
                }}
              />
            )}

            <div className={styles.cardMeta}>
              <h3 className={styles.cardName}>{d.name}</h3>
              <p className={styles.cardDesc}>{d.description}</p>
              <div className={styles.cardFoot}>
                <span className={`mono ${styles.cardPrice}`}>{formatPrice(d.price)}</span>
                <span className={styles.cardArrow}>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className={`container ${styles.cta}`}>
        <Link href="/menu" className="btn is-light">
          Lihat menu lengkap
          <span className="arrow" aria-hidden> →</span>
        </Link>
      </div>
    </section>
  );
}
