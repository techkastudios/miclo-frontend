import { Hero } from "@/components/site/Hero";
import { apiFetchJson, getHeroBanner, getProducts } from "@/lib/api";
import { resolvePublicImageUrl } from "@/lib/utils";
import EditorialGrid from "@/app/(components)/EditorialGrid";
import type { CategoryApiResponse } from "@/types";

const FALLBACK_HERO_SRC = "/assets/default-banner.jpeg";

type Params = Promise<{ slug: string }>;

async function CategoryPage(props: { params: Params }) {
    const { slug } = await props.params;

    let heroBanner = FALLBACK_HERO_SRC;

    const res = await apiFetchJson<CategoryApiResponse>(`/api/v1/categories/${slug}`);

    if (res.ok) {
        const resolved = resolvePublicImageUrl(res.data.data.image);
        if (resolved) heroBanner = resolved;
    }

    const { data } = await getHeroBanner("category_hero", heroBanner);
    const productsResult = await getProducts({ category: slug, next: { revalidate: 60 } });
    const products = productsResult.ok ? productsResult.data.data : [];

    return (
        <>
            <Hero {...data} />
            <EditorialGrid products={products} />
        </>
    );
}

export default CategoryPage;
