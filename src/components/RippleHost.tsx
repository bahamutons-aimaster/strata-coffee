'use client';

import { useEffect, useRef } from 'react';

let rippleId = 0;

export function RippleHost() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const onClick = (e: MouseEvent) => {
      // Hormati prefer-reduced-motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      ripple.dataset.rid = String(++rippleId);
      host.appendChild(ripple);

      // Bersihkan setelah animasi selesai
      const cleanup = () => ripple.remove();
      ripple.addEventListener('animationend', cleanup, { once: true });
      // safety net
      setTimeout(cleanup, 1500);
    };

    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  return <div ref={hostRef} className="ripple-host" aria-hidden />;
}
