import { getContent } from '@/lib/content';
import { NewsClient } from './NewsClient';

export const metadata = {
  title: 'News & Stories — Strata Coffee',
  description: 'Cerita dari dapur, rooftop, dan cangkir kami. Artikel tentang kopi, event, dan kehidupan sehari-hari Strata.',
};

export default async function NewsPage() {
  const { articles } = await getContent();
  // Sort terbaru dulu
  const sorted = [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  return <NewsClient articles={sorted} />;
}
