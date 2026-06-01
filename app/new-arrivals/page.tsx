import { Hero } from "@/components/site/Hero";
import { getHeroBanner } from "@/lib/api";
import InfiniteScroll from "../(components)/InfiniteScroll";

const FALLBACK_HERO_SRC = "/assets/default-banner.jpeg";

async function NewArrivals() {
    const { data: bannerData } = await getHeroBanner("product_page", FALLBACK_HERO_SRC);

    return (
        <>
            <Hero {...bannerData} />
            <InfiniteScroll productType="latest" hasFullColumnsProduct={false} />
        </>
    );
}

export default NewArrivals;
