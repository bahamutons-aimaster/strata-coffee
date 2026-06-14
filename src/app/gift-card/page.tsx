'use client';

import { useState } from 'react';
import styles from './gift.module.css';

const denominations = [50_000, 100_000, 250_000, 500_000];

const formatPrice = (idr: number) => 'IDR ' + idr.toLocaleString('id-ID');

export default function GiftCardPage() {
  const [amount, setAmount] = useState(100_000);
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('Selamat. Naik sebentar — kopi di kami.');

  return (
    <main className={`asphalt ${styles.page}`}>
      <div className="grit-overlay" aria-hidden />

      <section className={`container ${styles.hero}`}>
        <span className="eyebrow" style={{ color: 'var(--paper)' }}>
          GIFT CARD
        </span>
        <h1 className={`display ${styles.title}`}>
          Kado yang
          <br />
          <span className={styles.titleAccent}>tidak basa-basi.</span>
        </h1>
        <p className={styles.lead}>
          Beli sekali, tukar kapan saja di Strata Coffee. Tanpa kadaluarsa,
          tanpa syarat tersembunyi, tanpa drama. Cocok untuk teman, partner,
          atau dirimu sendiri yang sudah bekerja keras minggu ini.
        </p>
      </section>

      <div className="marking" aria-hidden style={{ opacity: 0.6 }} />

      <section className={`container ${styles.builder}`}>
        {/* Preview kartu */}
        <div className={styles.previewWrap}>
          <div className={styles.card}>
            <div className={styles.cardTexture} aria-hidden />
            <div className={styles.cardHead}>
              <span className={styles.cardBrand}>STRATA</span>
              <span className="mono">GIFT CARD</span>
            </div>
            <div className={styles.cardMid}>
              <span className="mono">SENILAI</span>
              <span className={styles.cardAmount}>{formatPrice(amount)}</span>
            </div>
            <div className={styles.cardFoot}>
              <div>
                <span className="mono">UNTUK</span>
                <p>{recipient || '—'}</p>
              </div>
              <div>
                <span className="mono">PESAN</span>
                <p>{message}</p>
              </div>
            </div>
            <div className={styles.cardSerial}>
              <span className="mono">№ XXX-XXXX-XXXX · ISSUED 2026</span>
            </div>
          </div>
          <p className={styles.previewHint}>
            <span className="mono">PREVIEW</span> · Kartu akan dikirim digital
            sebagai PDF + voucher fisik di toko.
          </p>
        </div>

        {/* Form */}
        <form className={styles.form}>
          <div className={styles.section}>
            <label className="mono">01 · NOMINAL</label>
            <div className={styles.denoms}>
              {denominations.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setAmount(d)}
                  className={`${styles.deno} ${amount === d ? styles.denoActive : ''}`}
                  data-cursor="hover"
                >
                  {formatPrice(d)}
                </button>
              ))}
            </div>
            <div className={styles.customAmount}>
              <span className="mono">ATAU KETIK SENDIRI</span>
              <input
                type="number"
                min={25_000}
                max={5_000_000}
                step={5000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className={styles.section}>
            <label htmlFor="recipient" className="mono">02 · UNTUK SIAPA</label>
            <input
              id="recipient"
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Nama penerima"
            />
          </div>

          <div className={styles.section}>
            <label htmlFor="msg" className="mono">03 · PESAN PRIBADI</label>
            <textarea
              id="msg"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={140}
            />
            <span className={styles.charCount}>
              {message.length}/140
            </span>
          </div>

          <div className={styles.cta}>
            <a
              href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                `Halo Strata, saya mau pesan gift card ${formatPrice(amount)} untuk ${recipient || '—'}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn is-marking"
            >
              Pesan via WhatsApp
              <span className="arrow" aria-hidden>→</span>
            </a>
            <span className={styles.ctaNote}>
              Pembayaran transfer · Konfirmasi 1×24 jam
            </span>
          </div>
        </form>
      </section>

      <section className={`container ${styles.terms}`}>
        <h2 className={`display ${styles.termsTitle}`}>Aturan main.</h2>
        <ol className={styles.termsList}>
          <li>
            <span className="mono">01</span>
            <p>Gift card berlaku tanpa kadaluarsa. Mau ditukar tahun ini atau
            lima tahun lagi, sama saja.</p>
          </li>
          <li>
            <span className="mono">02</span>
            <p>Dapat digunakan untuk semua menu Strata Coffee — termasuk merchandise dan event ticket.</p>
          </li>
          <li>
            <span className="mono">03</span>
            <p>Tidak dapat ditukar uang tunai, tapi sisa saldo tetap tersimpan untuk kunjungan berikutnya.</p>
          </li>
          <li>
            <span className="mono">04</span>
            <p>Kartu fisik bisa diambil di toko atau kami kirim via JNE/JNT.</p>
          </li>
        </ol>
      </section>
    </main>
  );
}
