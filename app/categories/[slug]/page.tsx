import { Hero } from "@/components/site/Hero";
import { apiFetchJson, getHeroBanner } from "@/lib/api";
import { resolvePublicImageUrl } from "@/lib/utils";
import InfiniteScroll from "@/app/(components)/InfiniteScroll";
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

    return (
        <>
            <Hero {...data} />
            <section className="py-12">
                <InfiniteScroll category={slug} />
            </section>
        </>
    );
}

export default CategoryPage;
