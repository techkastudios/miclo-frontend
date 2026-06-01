"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getProduct } from "@/lib/api";
import type { ProductResponse } from "@/types";
import { ShareButton } from "./ShareButton";

interface ProductDetailsProps {
    slug: string;
}

export function ProductDetails({ slug }: ProductDetailsProps) {
    const [product, setProduct] = useState<ProductResponse | null>(null);
    const [selectedImage, setSelectedImage] = useState(0);
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
        return (
            <div className="flex items-center justify-center p-16">
                <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex items-center justify-center p-16">
                <span className="text-sm text-muted-foreground">Product not found.</span>
            </div>
        );
    }

    const images =
        product.gallery && product.gallery.length > 0
            ? [product.featured_image, ...product.gallery]
            : [product.featured_image];

    const productUrl =
        typeof window !== "undefined"
            ? `${window.location.origin}/products/${product.slug}`
            : `/products/${product.slug}`;

    return (
        <div className="flex flex-col md:flex-row gap-6 p-6">
            <div className="flex-1">
                <div className="relative aspect-square overflow-hidden bg-surface">
                    <Image
                        src={images[selectedImage]}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>
                {images.length > 1 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto">
                        {images.map((img, i) => (
                            <button
                                key={img}
                                onClick={() => setSelectedImage(i)}
                                className={`relative h-16 w-16 flex-shrink-0 overflow-hidden border-2 transition-colors ${
                                    i === selectedImage
                                        ? "border-foreground"
                                        : "border-transparent hover:border-foreground/30"
                                }`}
                            >
                                <Image
                                    src={img}
                                    alt=""
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                />
                            </button>
                        ))}
                    </div>
                )}
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
