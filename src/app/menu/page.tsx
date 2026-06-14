import { getContent } from '@/lib/content';
import { MenuClient } from './MenuClient';

export default function MenuPage() {
  const { drinks } = getContent();
  return <MenuClient drinks={drinks} />;
}
