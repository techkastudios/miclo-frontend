"use client";

import Link from "next/link";

export interface DropdownProduct {
    id: string;
    name: string;
    image: string;
    href: string;
}

export interface DropdownData {
    baseHref: string;
    products: DropdownProduct[];
}

export function MegaDropdown({
    data,
    visible,
    onMouseEnter,
    onMouseLeave,
}: {
    data: DropdownData;
    visible: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}) {
    return (
        <div
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={`fixed left-0 right-0 bg-background border-t-2 border-t-black shadow-lg transition-all duration-200 z-40 ${
                visible
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-1 pointer-events-none"
            }`}
            style={{ top: "var(--header-height, 105px)" }}
        >
            <div className="flex container mx-auto">
                <div className="w-52 shrink-0 border-r-2 border-black/10 py-8 px-8 flex flex-col gap-3">
                    <Link
                        href={data.baseHref}
                        className="block text-sm font-bold tracking-widest uppercase text-black hover:text-red-600 transition-colors duration-150 py-0.5"
                    >
                        All items
                    </Link>
                    <Link
                        href={`${data.baseHref}/new-arrivals`}
                        className="block text-sm tracking-widest uppercase text-black/60 hover:text-red-600 transition-colors duration-150 py-0.5"
                    >
                        New Arrivals
                    </Link>
                    <Link
                        href={`${data.baseHref}/collections`}
                        className="block text-sm tracking-widest uppercase text-black/60 hover:text-red-600 transition-colors duration-150 py-0.5"
                    >
                        Collections
                    </Link>
                </div>

                <div className="flex-1 py-8 px-8">
                    <div className="grid grid-cols-4 gap-5 xl:grid-cols-6 2xl:grid-cols-7">
                        {data.products.map((product) => (
                            <Link
                                key={product.id}
                                href={product.href}
                                className="group/product block"
                            >
                                <div className="aspect-square w-full overflow-hidden bg-neutral-100 mb-2">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover/product:scale-105"
                                    />
                                </div>
                                <p className="uppercase group-hover/product:text-red-600 transition-colors duration-150 text-center">
                                    {product.name}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
