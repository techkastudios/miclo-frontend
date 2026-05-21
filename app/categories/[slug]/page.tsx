import { Hero } from "@/components/site/Hero";
import { getHeroBanner, getProducts } from "@/lib/api";
import EditorialGrid from "@/app/(components)/EditorialGrid";

const FALLBACK_HERO_SRC = "/assets/hero.jpg";

type Params = Promise<{ slug: string }>;

async function CategoryPage(props: { params: Params }) {
    const { slug } = await props.params;

    const bannerData = await getHeroBanner("category_hero", FALLBACK_HERO_SRC);
    const productsResult = await getProducts({ category: slug, next: { revalidate: 60 } });
    const products = productsResult.ok ? productsResult.data.data : [];

    return (
        <>
            <Hero {...bannerData} />
            <EditorialGrid products={products} />
        </>
    );
}

export default CategoryPage;
