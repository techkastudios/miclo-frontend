"use client";

import { useEffect, useState } from "react";
import { getProduct } from "@/lib/api";
import type { ProductResponse } from "@/types";
import { ShareButton } from "./ShareButton";
import ProductSlide from "./ProductSlide";

interface ProductDetailsProps {
    slug: string;
}

function Skeleton() {
    return (
        <div className="flex flex-col md:flex-row gap-6 p-6 animate-pulse">
            <div className="flex-1">
                <div className="relative aspect-square w-full overflow-hidden bg-surface">
                    <div className="h-full w-full bg-muted" />
                </div>
            </div>
            <div className="flex flex-col gap-4 flex-1">
                <div className="space-y-3">
                    <div className="h-3 w-20 bg-muted rounded" />
                    <div className="h-6 w-3/4 bg-muted rounded" />
                    <div className="h-4 w-full bg-muted rounded" />
                </div>
                <div className="h-8 w-28 bg-muted rounded mt-2" />
                <hr className="border-border" />
                <div className="flex items-center gap-3">
                    <div className="h-3 w-10 bg-muted rounded" />
                    <div className="h-8 w-8 rounded-full bg-muted" />
                    <div className="h-8 w-8 rounded-full bg-muted" />
                    <div className="h-8 w-8 rounded-full bg-muted" />
                </div>
                <hr className="border-border" />
                <div className="space-y-1">
                    <div className="h-3 w-32 bg-muted rounded" />
                    <div className="h-3 w-24 bg-muted rounded" />
                </div>
            </div>
        </div>
    );
}

export function ProductDetails({ slug }: ProductDetailsProps) {
    const [product, setProduct] = useState<ProductResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const result = await getProduct(slug, { next: { revalidate: 0 } });
            if (result.ok) {
                setProduct(result.data.data);
            }
            setLoading(false);
        })();
    }, [slug]);

    if (loading) {
        return <Skeleton />;
    }

    if (!product) {
        return (
            <div className="flex items-center justify-center p-16">
                <span className="text-sm text-muted-foreground">Product not found.</span>
            </div>
        );
    }

    const productUrl =
        typeof window !== "undefined"
            ? `${window.location.origin}/products/${product.slug}`
            : `/products/${product.slug}`;

    return (
        <div className="flex flex-col md:flex-row gap-6 p-6">
            <div className="flex-1">
                <ProductSlide featuredImage={product.featured_image} gallery={product.gallery} />
            </div>

            <div className="flex flex-col gap-4 flex-1">
                <div>
                    <p className="text-xs uppercase tracking-display text-muted-foreground">
                        {product.category?.name}
                    </p>
                    <h2 className="text-xl font-semibold mt-1">{product.name}</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        {product.short_description}
                    </p>
                </div>

                {product.sale_price ? (
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-semibold text-brand">
                            ${product.sale_price.amount}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                            ${product.price.amount}
                        </span>
                        {product.discount_percentage && (
                            <span className="text-xs text-brand">
                                -{product.discount_percentage}%
                            </span>
                        )}
                    </div>
                ) : (
                    <span className="text-2xl font-semibold">${product.price.amount}</span>
                )}

                <hr className="border-border" />

                <ShareButton url={productUrl} title={product.name} />

                <hr className="border-border" />

                <div className="text-xs text-muted-foreground space-y-1">
                    <p>SKU: {product.sku}</p>
                    {product.status && <p>Status: {product.status}</p>}
                </div>
            </div>
        </div>
    );
}
