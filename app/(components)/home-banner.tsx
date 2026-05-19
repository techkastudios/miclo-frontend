import { Hero } from "@/components/site/Hero";
import { getHeroBanner } from "@/lib/api";
const FALLBACK_HERO_SRC = '/assets/default-banner.jpeg';
export default async function HomeBanner(){
    const bannerData = await getHeroBanner( 'home_hero', FALLBACK_HERO_SRC);

    return (
        <Hero {...bannerData} />
    )   
}