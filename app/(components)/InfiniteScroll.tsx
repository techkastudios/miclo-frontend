"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getProducts } from "@/lib/api";
import type { ProductResponse } from "@/types";
import EditorialGrid from "./EditorialGrid";

interface InfiniteScrollProps {
    productType?: string;
    category?: string;
    hasFullColumnsProduct?: boolean;
}

const INITIAL_PER_PAGE = 9;
const LOAD_MORE_PER_PAGE = 6;

export default function InfiniteScroll({
    productType,
    category,
    hasFullColumnsProduct,
}: InfiniteScrollProps) {
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const sentinelRef = useRef<HTMLDivElement>(null);

    const fetchProducts = useCallback(
        async (pageNum: number, perPage: number) => {
            setLoading(true);
            const result = await getProducts({
                ...(productType ? { type: productType } : {}),
                ...(category ? { category } : {}),
                page: pageNum,
                perPage,
                next: { revalidate: 0 },
            });
            setLoading(false);

            if (!result.ok) return null;

            const { data, meta } = result.data;
            const lastPage = meta?.pagination.last_page ?? pageNum;
            if (pageNum >= lastPage) setHasMore(false);

            return data;
        },
        [productType, category],
    );

    useEffect(() => {
        (async () => {
            setInitialLoading(true);
            const data = await fetchProducts(1, INITIAL_PER_PAGE);
            if (data) {
                setProducts(data);
                setPage(2);
            }
            setInitialLoading(false);
        })();
    }, [fetchProducts]);

    useEffect(() => {
        if (!hasMore || initialLoading) return;

        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading && hasMore) {
                    (async () => {
                        const data = await fetchProducts(page, LOAD_MORE_PER_PAGE);
                        if (data) {
                            setProducts((prev) => [...prev, ...data]);
                            setPage((prev) => prev + 1);
                        }
                    })();
                }
            },
            { rootMargin: "200px" },
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasMore, loading, initialLoading, page, fetchProducts]);

    return (
        <>
            {initialLoading ? (
                <div className="flex items-center justify-center py-20">
                    <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
            ) : (
                <EditorialGrid products={products} hasFullColumnsProduct={hasFullColumnsProduct} />
            )}
            {hasMore && !initialLoading && <div ref={sentinelRef} className="h-4" />}
            {loading && !initialLoading && (
                <div className="flex items-center justify-center py-10">
                    <span className="text-sm text-muted-foreground">Loading more...</span>
                </div>
            )}
        </>
    );
}
