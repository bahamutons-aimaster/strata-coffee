import Image from 'next/image';
import styles from './ScrollStory.module.css';
import type { StoryChapter } from '@/lib/content';

export function ScrollStory({ chapters }: { chapters: StoryChapter[] }) {
  if (!chapters || chapters.length === 0) return null;

  return (
    <section className={styles.story} id="story">
      {chapters.map((c, i) => (
        <article key={c.id} className={styles.chapter}>
          {/* Full-bleed background foto + tint */}
          <div className={styles.bg}>
            <Image
              src={c.image}
              alt={`${c.time} — ${c.title}`}
              fill
              sizes="100vw"
              priority={i === 0}
              className={styles.bgImg}
            />
            <div
              className={styles.tint}
              style={{
                background: `linear-gradient(170deg, ${c.tintFrom} 0%, ${c.tintTo} 100%)`,
              }}
              aria-hidden
            />
            {/* Grit texture biar ada rasa asphalt */}
            <div className={styles.grit} aria-hidden />
          </div>

          {/* Konten teks */}
          <div className={`container ${styles.content}`}>
            <div className={`${styles.head} reveal`}>
              <span className={`${styles.dash}`} aria-hidden />
              <span className={`mono ${styles.time}`}>{c.time}</span>
              <span className={`mono ${styles.num}`}>
                {String(i + 1).padStart(2, '0')} / {String(chapters.length).padStart(2, '0')}
              </span>
            </div>

            <h3 className={`display ${styles.title} reveal`}>{c.title}</h3>

            <p className={`${styles.body} reveal`}>{c.body}</p>
          </div>

          {/* Time dot navigation di kanan */}
          <nav className={styles.timeDots} aria-label="Chapter navigation">
            {chapters.map((ch, j) => (
              <span
                key={ch.id}
                className={`${styles.timeDot} ${j === i ? styles.timeDotActive : ''}`}
                title={ch.time}
              />
            ))}
          </nav>
        </article>
      ))}
    </section>
  );
}
