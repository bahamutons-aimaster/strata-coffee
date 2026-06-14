'use client';

import { useEffect, useRef } from 'react';

export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Hindari di device touch
    if (window.matchMedia('(hover: none)').matches) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;

    const move = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const tick = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    let raf = requestAnimationFrame(tick);

    // Hover state untuk element clickable
    const isHoverable = (target: EventTarget | null) => {
      const node = target as HTMLElement | null;
      if (!node || !node.closest) return false;
      return !!node.closest(
        'a, button, [data-cursor="hover"], input, textarea, select, label'
      );
    };
    const over = (e: MouseEvent) => {
      el.classList.toggle('is-hover', isHoverable(e.target));
    };

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mouseover', over, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
    };
  }, []);

  return <div ref={ref} className="cursor" aria-hidden />;
}
