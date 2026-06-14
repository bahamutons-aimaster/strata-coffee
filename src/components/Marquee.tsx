import styles from './Marquee.module.css';

const phrases = [
  'STRATA COFFEE',
  'COFFEE WITH A VIEW',
  '720M ABOVE SEA',
  'BANDUNGAN · SEMARANG',
  'SINCE 2026',
];

export function Marquee() {
  return (
    <div className={styles.marquee} aria-hidden>
      <div className={styles.track}>
        {[...phrases, ...phrases, ...phrases].map((p, i) => (
          <span key={i} className={styles.item}>
            <span className={styles.label}>{p}</span>
            <span className={styles.dot}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
