import { ProductDetails } from "@/app/(components)/ProductDetails";

type Params = Promise<{ slug: string }>;

export default async function ProductPage(props: { params: Params }) {
    const { slug } = await props.params;

    return (
        <section className="mx-auto max-w-5xl px-4 py-16">
            <ProductDetails slug={slug} />
        </section>
    );
}
