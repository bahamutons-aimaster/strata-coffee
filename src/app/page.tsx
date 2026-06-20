import { Hero } from '@/components/Hero';
import { Marquee } from '@/components/Marquee';
import { ScrollStory } from '@/components/ScrollStory';
import { ShowcaseSlider } from '@/components/ShowcaseSlider';
import { FeaturedDrinks } from '@/components/FeaturedDrinks';
import { LatestNews } from '@/components/LatestNews';
import { VisitBlock } from '@/components/VisitBlock';
import { getContent } from '@/lib/content';

export default async function HomePage() {
  const content = await getContent();

  const featuredDrinks = content.drinks.filter((d) => d.featured);
  const drinksToShow = featuredDrinks.length > 0
    ? featuredDrinks
    : content.drinks.filter((d) => !!d.image).slice(0, 4);

  return (
    <main>
      <Hero slides={content.hero.slides} />
      <Marquee />
      <ScrollStory chapters={content.story.chapters} />

      {/* Full-width showcase slider */}
      <ShowcaseSlider slides={content.showcase.slides} />

      {/* Featured drinks grid — compact di bawah slider */}
      <FeaturedDrinks drinks={drinksToShow} />

      <LatestNews articles={content.articles} />
      <VisitBlock site={content.site} />
    </main>
  );
}
