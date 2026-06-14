import { notFound } from 'next/navigation';
import { getContent } from '@/lib/content';
import { ArticleClient } from './ArticleClient';

export async function generateStaticParams() {
  const { articles } = getContent();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { articles } = getContent();
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) return {};
  return {
    title: `${article.title} — Strata Coffee`,
    description: article.excerpt,
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const { articles } = getContent();
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) notFound();

  const related = articles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  return <ArticleClient article={article} related={related} />;
}
