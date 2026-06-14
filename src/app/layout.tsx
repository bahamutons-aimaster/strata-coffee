import type { Metadata } from 'next';
import { Bebas_Neue, Inter, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { ClientFrame } from '@/components/ClientFrame';
import { getContent } from '@/lib/content';

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});
const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Strata Coffee — Coffee with a View',
  description:
    'Specialty coffee dari sebuah rooftop kecil di kaki gunung. Setiap cangkir punya lapisannya sendiri.',
  openGraph: {
    title: 'Strata Coffee',
    description: 'Specialty coffee dari sebuah rooftop kecil di kaki gunung.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { site } = getContent();
  return (
    <html
      lang="id"
      className={`${bebas.variable} ${inter.variable} ${mono.variable}`}
    >
      <body>
        <ClientFrame site={site}>{children}</ClientFrame>
      </body>
    </html>
  );
}
