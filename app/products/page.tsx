import InfiniteScroll from "../(components)/InfiniteScroll";

export default function ProductsPage() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-12">
            <h1 className="text-3xl font-semibold tracking-tight mb-10">All Products</h1>
            <InfiniteScroll />
        </section>
    );
}
