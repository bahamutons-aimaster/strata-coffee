'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/** Komponen invisible — catat pageview ke /api/analytics setiap navigasi */
export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Jangan track halaman admin
    if (pathname.startsWith('/admin')) return;

    // Kirim pageview ke API dengan sedikit delay agar tidak blocking render
    const timer = setTimeout(() => {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: pathname,
          ref: document.referrer || 'direct',
        }),
        // fire-and-forget — tidak perlu tunggu response
      }).catch(() => { /* silent fail */ });
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
