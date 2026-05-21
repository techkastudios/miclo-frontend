import { ProductResponse } from "@/types/apiResponseTypes";
import { CiInstagram as IgIcon } from "react-icons/ci";
import Image from "next/image";

interface EditorialGridProps {
    products: ProductResponse[];
}

export default function EditorialGrid({ products }: EditorialGridProps) {
    const getColSpanClass = (index: number): string => {
        // Row 1: First 3 products (Indices 0, 1, 2) -> 3 columns
        if (index < 3) return "col-span-2";

        // Row 2: 4th product (Index 3) -> 1 big full-width column
        if (index === 3) return "col-span-6 min-h-[350px]"; // Extra height for the spotlight item

        // 2 items (50-50), then 3 items (3-columns)
        const positionInLoop = (index - 4) % 5;

        // First 2 items in the loop -> 2 columns (50-50)
        if (positionInLoop < 2) return "col-span-3 ";

        // Remaining 3 items in the loop -> 3 columns
        return "col-span-2";
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-6 my-6">
            {products.map((product, index) => {
                const spanClass = getColSpanClass(index);

                return (
                    <div key={product.id} className={`${spanClass}`}>
                        {/* Replace this placeholder content with your actual product card design */}
                        <a
                            href="#"
                            className="group relative block aspect-square overflow-hidden bg-surface"
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
                        </a>
                    </div>
                );
            })}
        </div>
    );
}
