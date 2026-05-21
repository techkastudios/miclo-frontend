import { ProductResponse } from "@/types/apiResponseTypes";
import { CiInstagram as IgIcon } from "react-icons/ci";
import Image from "next/image";

interface EditorialGridProps {
    products: ProductResponse[];
    hasFullColumnsProduct?: boolean;
}

export default function EditorialGrid({
    products,
    hasFullColumnsProduct = true,
}: EditorialGridProps) {
    const getColSpanClass = (index: number): string => {
        if (!hasFullColumnsProduct) {
            const positionInLoop = index % 5;
            if (positionInLoop < 3) return "col-span-2 aspect-square";
            return "col-span-3 aspect-2/1.5";
        }

        if (index < 3) return "col-span-2 aspect-square";
        if (index === 3) return "col-span-6 min-h-[350px] aspect-2/0.75";

        const positionInLoop = (index - 4) % 5;
        if (positionInLoop < 2) return "col-span-3 aspect-2/1.5";
        return "col-span-2 aspect-square";
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-6 my-6">
            {products.map((product, index) => {
                const spanClass = getColSpanClass(index);

                return (
                    <a
                        key={product.id}
                        className={`${spanClass} group relative block  overflow-hidden bg-surface`}
                        href="#"
                        // className="group relative block aspect-square overflow-hidden bg-surface"
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
                );
            })}
        </div>
    );
}
