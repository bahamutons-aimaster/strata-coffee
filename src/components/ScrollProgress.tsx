'use client';

import { useEffect, useRef } from 'react';

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let raf = 0;
    const update = () => {
      const doc = document.documentElement;
      const scrolled = window.scrollY;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? scrolled / max : 0;
      bar.style.setProperty('--p', String(p));
      bar.style.height = `${p * 100}vh`;
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden>
      <div ref={barRef} className="scroll-progress__bar" />
    </div>
  );
}
