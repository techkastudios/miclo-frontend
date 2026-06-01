"use client";

import { CiInstagram as IgIcon } from "react-icons/ci";
import Image from "next/image";
import Link from "next/link";
import { ProductResponse } from "@/types";

interface EditorialGridProps {
    products: ProductResponse[];
    hasFullColumnsProduct?: boolean;
}

export default function EditorialGrid({
    products,
    hasFullColumnsProduct = true,
}: EditorialGridProps) {
    const getMobileColSpanClass = (index: number): string => {
        const positionInLoop = index % 3;
        if (positionInLoop === 2) return "col-span-2 aspect-2/1";
        return "col-span-1 aspect-square";
    };

    const getColSpanClass = (index: number): string => {
        if (!hasFullColumnsProduct) {
            const positionInLoop = index % 5;
            if (positionInLoop < 3) return "sm:col-span-2 sm:aspect-square";
            return "sm:col-span-3 sm:aspect-2/1.5";
        }

        if (index < 3) return "sm:col-span-2 sm:aspect-square";
        if (index === 3) return "sm:col-span-6 sm:min-h-[350px] sm:aspect-2/0.75";

        const positionInLoop = (index - 4) % 5;
        if (positionInLoop < 2) return "sm:col-span-3 sm:aspect-2/1.5";
        return "sm:col-span-2 sm:aspect-square";
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 my-3 md:gap-6 md:my-6">
            {products.map((product, index) => {
                const mobileClass = getMobileColSpanClass(index);
                const desktopClass = getColSpanClass(index);

                return (
                    <Link
                        key={`${product.id}-${index}`}
                        href={`/products/${product.slug}`}
                        scroll={false}
                        className={`${mobileClass} ${desktopClass} group relative block overflow-hidden bg-surface`}
                    >
                        <Image
                            src={product.featured_image}
                            alt=""
                            loading="lazy"
                            className="object-cover transition-transform duration-1200 ease-out group-hover:scale-110"
                            fill={true}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 opacity-0 transition-all duration-300 group-hover:bg-foreground/40 group-hover:opacity-100">
                            <IgIcon className="h-6 w-6 text-white" />
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
