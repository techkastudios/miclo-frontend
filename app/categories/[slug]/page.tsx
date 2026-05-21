import { Hero } from "@/components/site/Hero";
import { getHeroBanner } from "@/lib/api";

const FALLBACK_HERO_SRC = "/assets/hero.jpg";

async function CategoryPage() {
    const bannerData = await getHeroBanner("category_hero", FALLBACK_HERO_SRC);

    return <Hero {...bannerData} />;
}

export default CategoryPage;
