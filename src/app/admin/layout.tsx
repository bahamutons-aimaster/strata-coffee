import type { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Tabler Icons — untuk icon sidebar admin */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.x/dist/tabler-icons.min.css"
      />
      {children}
    </>
  );
}
