'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Drink } from '@/lib/content';
import styles from './menu.module.css';

const categories = [
  { id: 'all', label: 'Semua' },
  { id: 'signature', label: 'Signature' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'non-coffee', label: 'Non-Coffee' },
  { id: 'tea', label: 'Tea' },
];

const formatPrice = (idr: number) => 'IDR ' + idr.toLocaleString('id-ID');

export function MenuClient({ drinks }: { drinks: Drink[] }) {
  const [cat, setCat] = useState('all');
  const [active, setActive] = useState<Drink>(drinks[0]);

  const filtered =
    cat === 'all' ? drinks : drinks.filter((d) => d.category === cat);

  return (
    <main className={`asphalt-light ${styles.page}`}>
      <header className={`container ${styles.header}`}>
        <span className="eyebrow">CHAPTER 02 · WHAT WE POUR</span>
        <h1 className={`display ${styles.title}`}>
          Menu Strata.
          <br />
          <span className={styles.titleSub}>Lapis demi lapis.</span>
        </h1>
        <p className={styles.lead}>
          Empat kategori, tiga belas pilihan, satu obsesi: rasa yang
          berlapis. Arahkan kursor ke salah satu untuk melihat detailnya.
        </p>
      </header>

      <div className="marking" aria-hidden />

      <div className={`container ${styles.layout}`}>
        {/* Sidebar preview produk */}
        <aside className={styles.preview}>
          <div className={styles.previewSticky}>
            <div className={styles.previewCanvas}>
              {active.image ? (
                <Image
                  key={active.id}
                  src={active.image}
                  alt={active.name}
                  fill
                  sizes="(max-width: 980px) 80vw, 420px"
                  className={styles.previewImg}
                />
              ) : (
                <div
                  className={styles.previewSwatch}
                  style={{
                    background: `linear-gradient(180deg, ${active.colors.top}, ${active.colors.middle} 60%, ${active.colors.bottom})`,
                  }}
                />
              )}
            </div>
            <div className={styles.previewMeta}>
              <span className="mono">SHOWING</span>
              <h3 className={styles.previewName}>{active.name}</h3>
              <p className={styles.previewDesc}>{active.description}</p>
              <div className={styles.previewFoot}>
                <span className={`mono ${styles.previewPrice}`}>
                  {formatPrice(active.price)}
                </span>
                <span className={`mono ${styles.previewCat}`}>
                  · {active.category.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Daftar minuman */}
        <section className={styles.list}>
          <div className={styles.filters} role="tablist">
            {categories.map((c) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={cat === c.id}
                onClick={() => setCat(c.id)}
                className={`${styles.filter} ${cat === c.id ? styles.filterActive : ''}`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <ul className={styles.items}>
            {filtered.map((d, i) => (
              <li
                key={d.id}
                id={d.id}
                className={`${styles.item} ${active.id === d.id ? styles.itemActive : ''}`}
                onMouseEnter={() => setActive(d)}
                onFocus={() => setActive(d)}
                onClick={() => setActive(d)}
                tabIndex={0}
              >
                <span className={`mono ${styles.itemIdx}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {d.image ? (
                  <div className={styles.itemThumb}>
                    <Image
                      src={d.image}
                      alt={d.name}
                      width={200}
                      height={250}
                    />
                  </div>
                ) : (
                  <div
                    className={styles.itemSwatch}
                    style={{
                      background: `linear-gradient(180deg, ${d.colors.top}, ${d.colors.middle} 60%, ${d.colors.bottom})`,
                    }}
                  />
                )}
                <div className={styles.itemBody}>
                  <h4 className={styles.itemName}>{d.name}</h4>
                  <p className={styles.itemDesc}>{d.description}</p>
                  {d.tags && (
                    <div className={styles.itemTags}>
                      {d.tags.map((t) => (
                        <span key={t} className="mono">
                          · {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className={`mono ${styles.itemPrice}`}>
                  {formatPrice(d.price)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
