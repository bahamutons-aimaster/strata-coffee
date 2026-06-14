import Image from 'next/image';
import Link from 'next/link';
import styles from './about.module.css';

const timeline = [
  {
    year: '2024',
    title: 'Ide pertama',
    body:
      'Tiga teman duduk di rooftop kosong milik nenek. Ngobrol soal kopi sampai pagi. Ide Strata lahir di sini — di lapisan paling bawah: keinginan.',
  },
  {
    year: '2025',
    title: 'Membangun fondasi',
    body:
      'Tukang bekerja paralel dengan barista. Bangunan disusun lapis demi lapis. Resep kopi disesuaikan dengan air sumur lokal yang berbeda mineralnya.',
  },
  {
    year: 'Awal 2026',
    title: 'Soft opening',
    body:
      'Tiga puluh tamu pertama datang. Beberapa karena penasaran, beberapa karena tersesat. Semua pulang dengan secangkir gratis dan undangan datang lagi.',
  },
  {
    year: 'Sekarang',
    title: 'Lapis demi lapis',
    body:
      'Tujuh anggota tim. Empat menu signature. Satu tujuan: jadi tempat yang membuat sore terasa lebih panjang.',
  },
];

export default function AboutPage() {
  return (
    <main className={`asphalt-light ${styles.page}`}>
      {/* Hero */}
      <section className={`container ${styles.hero}`}>
        <span className="eyebrow">TENTANG KAMI</span>
        <h1 className={`display ${styles.title}`}>
          Strata, artinya
          <br />
          <span className={styles.titleAccent}>lapisan.</span>
        </h1>
        <p className={styles.lead}>
          Kami suka cara hal-hal baik dibangun: pelan, dan satu lapis pada
          waktunya. Kopi yang baik begitu. Pemandangan yang baik begitu.
          Tempat yang ingin kamu kembali ke sana — biasanya juga begitu.
        </p>
      </section>

      <div className="marking" aria-hidden />

      {/* Foto besar */}
      <section className={`container ${styles.bigPhoto}`}>
        <Image
          src="/assets/photos/exterior-soft-opening.png"
          alt="Eksterior Strata Coffee saat soft opening"
          width={1600}
          height={1200}
          className={styles.bigPhotoImg}
          priority
        />
        <div className={styles.bigPhotoCaption}>
          <span className="mono">EXT. STRATA · 17:30</span>
        </div>
      </section>

      {/* Manifesto 2 kolom */}
      <section className={`container ${styles.manifesto}`}>
        <h2 className={`display ${styles.manifestoTitle}`}>Tiga hal yang kami percayai.</h2>
        <div className={styles.manifestoGrid}>
          <div>
            <span className="mono">01</span>
            <h3>Kopi adalah produk pertanian.</h3>
            <p>
              Setiap biji punya cerita kebun. Kami beli dari petani yang kami
              kenal namanya — Pak Marno di Java, Pak Tora di Toraja, dan
              keluarga Bona di Gayo. Mereka tahu kami, kami tahu mereka.
            </p>
          </div>
          <div>
            <span className="mono">02</span>
            <h3>Tempat juga produk.</h3>
            <p>
              Kursi kami tidak nyaman secara sengaja. Bukan untuk menyiksa,
              tapi supaya kamu duduk dengan postur yang membuat percakapan
              jadi mungkin. Wifi kami cepat. Stop kontak kami ada. Tapi
              pemandangannya yang minta perhatianmu.
            </p>
          </div>
          <div>
            <span className="mono">03</span>
            <h3>Pelan-pelan, secara sengaja.</h3>
            <p>
              Kami tidak terburu-buru menambah cabang. Tidak terburu-buru
              naik harga. Tidak terburu-buru mengganti resep. Bisnis ini
              dibangun untuk durasi lama, seperti gunung di belakang kami.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline lapisan */}
      <section className={`asphalt ${styles.timelineWrap}`}>
        <div className="grit-overlay" aria-hidden />
        <div className={`container ${styles.timelineInner}`}>
          <span className="eyebrow" style={{ color: 'var(--paper)' }}>
            TIMELINE · LAPISAN
          </span>
          <h2 className={`display ${styles.timelineTitle}`}>
            Bagaimana kami sampai di sini.
          </h2>

          <ol className={styles.timeline}>
            {timeline.map((t, i) => (
              <li key={t.year} className={styles.timelineItem}>
                <span className={styles.timelineDot} aria-hidden />
                <div className={styles.timelineYear}>
                  <span className="mono">CHAPTER {String(i + 1).padStart(2, '0')}</span>
                  <span className={`display ${styles.timelineYearLabel}`}>{t.year}</span>
                </div>
                <div className={styles.timelineBody}>
                  <h3 className={styles.timelineHead}>{t.title}</h3>
                  <p>{t.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className={`container ${styles.cta}`}>
        <h2 className={`display ${styles.ctaTitle}`}>
          Pertanyaan,&nbsp;reservasi,
          <br />atau&nbsp;sekadar&nbsp;ngobrol?
        </h2>
        <Link href="/contact" className="btn is-light">
          Sapa kami
          <span className="arrow" aria-hidden>→</span>
        </Link>
      </section>
    </main>
  );
}
