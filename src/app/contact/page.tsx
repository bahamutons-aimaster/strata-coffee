'use client';

import { useState } from 'react';
import styles from './contact.module.css';

type FormState = {
  name: string;
  email: string;
  topic: 'reservasi' | 'kerjasama' | 'umpan-balik' | 'lain';
  message: string;
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    topic: 'reservasi',
    message: '',
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Buka WhatsApp dengan pesan terformat (backend bisa di-wire sendiri user)
    const text = encodeURIComponent(
      `Halo Strata Coffee — saya ${form.name}.\n` +
      `Topik: ${form.topic}\n\n` +
      `${form.message}\n\n` +
      `(Reply ke ${form.email})`
    );
    window.open(`https://wa.me/6281234567890?text=${text}`, '_blank');
    setSent(true);
  };

  return (
    <main className={`asphalt-light ${styles.page}`}>
      <section className={`container ${styles.hero}`}>
        <span className="eyebrow">CHAPTER 04 · MARI BICARA</span>
        <h1 className={`display ${styles.title}`}>
          Kirim pesan.<br />
          <span className={styles.titleAccent}>Kami balas.</span>
        </h1>
      </section>

      <div className="marking" aria-hidden />

      <section className={`container ${styles.layout}`}>
        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name" className="mono">01 · NAMA</label>
            <input
              id="name"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Siapa yang menyapa?"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email" className="mono">02 · EMAIL</label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="kamu@email.com"
            />
          </div>

          <div className={styles.field}>
            <label className="mono">03 · TOPIK</label>
            <div className={styles.topics}>
              {(['reservasi', 'kerjasama', 'umpan-balik', 'lain'] as const).map(
                (t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, topic: t })}
                    className={`${styles.topic} ${form.topic === t ? styles.topicActive : ''}`}
                    data-cursor="hover"
                  >
                    {t === 'lain' ? 'Lainnya' : t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="message" className="mono">04 · PESAN</label>
            <textarea
              id="message"
              required
              rows={6}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Ceritakan singkat saja."
            />
          </div>

          <button type="submit" className="btn is-light">
            {sent ? 'Membuka WhatsApp…' : 'Kirim via WhatsApp'}
            <span className="arrow" aria-hidden>→</span>
          </button>

          <p className={styles.note}>
            Tombol akan membuka WhatsApp dengan pesanmu sudah siap.
            Sambungan email asli bisa di-pasang nanti via backend.
          </p>
        </form>

        {/* Info kontak */}
        <aside className={styles.info}>
          <div className={styles.infoBlock}>
            <span className="mono">VIA TELEPON</span>
            <p className={`display ${styles.infoLine}`}>0812&nbsp;3456&nbsp;7890</p>
            <p className={styles.infoNote}>
              Telepon &amp; WhatsApp · 09.00–22.00 WIB
            </p>
          </div>

          <div className={styles.infoBlock}>
            <span className="mono">VIA EMAIL</span>
            <p className={`display ${styles.infoLine}`}>hello@stratacoffee.id</p>
            <p className={styles.infoNote}>
              Balasan biasanya dalam 1×24 jam.
            </p>
          </div>

          <div className={styles.infoBlock}>
            <span className="mono">VIA RESERVASI MEJA</span>
            <p className={styles.infoNote}>
              Untuk grup 8+ orang, mohon reservasi minimal 24 jam sebelumnya.
              Khusus akhir pekan, reservasi 48 jam sebelumnya.
            </p>
          </div>

          <div className={styles.infoBlock}>
            <span className="mono">ALAMAT</span>
            <p className={styles.infoAddr}>
              Jl. Kaki Gunung No. 12<br />
              Bandungan, Kab. Semarang<br />
              Jawa Tengah · 50665
            </p>
            <a
              href="https://maps.google.com/?q=Bandungan,Semarang"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapLink}
            >
              Buka di Google Maps →
            </a>
          </div>
        </aside>
      </section>
    </main>
  );
}
