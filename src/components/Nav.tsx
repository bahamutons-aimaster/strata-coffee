'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import styles from './Nav.module.css';

const links = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/news', label: 'News' },
  { href: '/about', label: 'About' },
  { href: '/gift-card', label: 'Gift Card' },
  { href: '/contact', label: 'Contact' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Tutup menu saat navigasi
  useEffect(() => { setOpen(false); }, [pathname]);

  // Lock body scroll saat menu mobile terbuka
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`} role="navigation">
      <div className={styles.inner}>
        {/* Brand */}
        <Link href="/" className={styles.brand} aria-label="Strata Coffee — Beranda">
         <img 
                   src="/assets/logo-strata.png" 
                   alt="Strata Coffee" 
                   width={87} 
                   height={70} 
                   style={{ objectFit: 'contain' }}
         />
          <span className={styles.brandText}>
            <span className={styles.brandName}>STRATA</span>
            <span className={styles.brandSub}>COFFEE · EST. 2026</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className={`${styles.links} ${open ? styles.linksOpen : ''}`} id="nav-menu" aria-label="Menu navigasi">
          {links.map((l, idx) => {
            const active = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`${styles.link} ${active ? styles.linkActive : ''}`}
                  onClick={() => setOpen(false)}
                >
                  <span className={styles.linkMono}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  {l.label}
                </Link>
              </li>
            );
          })}

          {/* CTA dalam mobile menu */}
          <li className={styles.mobileCta}>
            <Link href="/menu" className={styles.cta} style={{ display: 'inline-flex' }} onClick={() => setOpen(false)}>
              Order Sekarang
              <span aria-hidden className={styles.arrow}>→</span>
            </Link>
          </li>
        </ul>

        {/* CTA desktop */}
        <Link href="/menu" className={styles.cta}>
          Order
          <span aria-hidden className={styles.arrow}>→</span>
        </Link>

        {/* Burger */}
        <button
          className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={styles.burgerLine} />
          <span className={styles.burgerLine} />
          <span className={styles.burgerLine} />
        </button>
      </div>
    </nav>
  );
}
