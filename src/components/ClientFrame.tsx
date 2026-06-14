'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { Cursor } from './Cursor';
import { RippleHost } from './RippleHost';
import { ScrollProgress } from './ScrollProgress';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { LiveChat } from './LiveChat';
import { PromoPopup } from './PromoPopup';
import { PageTracker } from './PageTracker';
import type { SiteInfo } from '@/lib/content';

export function ClientFrame({
  children,
  site,
}: {
  children: React.ReactNode;
  site: SiteInfo;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  // Lenis smooth scroll — tidak di admin
  useEffect(() => {
    if (isAdmin) return;
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [isAdmin]);

  // Reveal on scroll — re-run setiap navigasi
  useEffect(() => {
    if (isAdmin) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    function observe() {
      document.querySelectorAll<HTMLElement>('.reveal, .word-up').forEach((el) => {
        el.classList.remove('in');
        io.observe(el);
      });
    }

    const raf1 = requestAnimationFrame(observe);
    const raf2 = requestAnimationFrame(() => requestAnimationFrame(observe));
    const t = setTimeout(observe, 300);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(t);
      io.disconnect();
    };
  }, [pathname, isAdmin]);

  // Admin: render tanpa chrome
  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Cursor />
      <RippleHost />
      <ScrollProgress />
      <Nav />
      {children}
      <Footer site={site} />

      {/* ── Global overlays — muncul di semua halaman ── */}
      <LiveChat site={site} />
      <PromoPopup site={site} />
      <PageTracker />
    </>
  );
}
