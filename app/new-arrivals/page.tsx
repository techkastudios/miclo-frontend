import { Hero } from "@/components/site/Hero";
import { getHeroBanner, getProducts } from "@/lib/api";
import EditorialGrid from "../(components)/EditorialGrid";

const FALLBACK_HERO_SRC = "/assets/hero.jpg";

async function NewArrivals() {
    const bannerData = await getHeroBanner("product_page", FALLBACK_HERO_SRC);
    const productsResult = await getProducts({ type: "latest", next: { revalidate: 60 } });
    const products = productsResult.ok ? productsResult.data.data : [];

    return (
        <>
            <Hero {...bannerData} />

            <EditorialGrid products={products} hasFullColumnsProduct={false} />
        </>
    );
}

export default NewArrivals;
