import { getContent } from '@/lib/content';
import { MenuClient } from './MenuClient';

export default async function MenuPage() {
  const { drinks } = await getContent();
  return <MenuClient drinks={drinks} />;
}
