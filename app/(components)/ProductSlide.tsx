"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import { CiImageOff } from "react-icons/ci";

function ProductSlide({
    featuredImage,
    gallery,
}: {
    featuredImage: string;
    gallery: string[] | null;
}) {
    const images =
        gallery && gallery.length > 0
            ? [featuredImage, ...gallery].filter(Boolean)
            : featuredImage
              ? [featuredImage]
              : [];

    if (images.length === 0) {
        return (
            <div className="w-full aspect-square bg-surface flex items-center justify-center">
                <CiImageOff className="size-16 text-muted-foreground/50" />
            </div>
        );
    }

    if (images.length === 1) {
        return (
            <div className="w-full aspect-square relative">
                <Image src={images[0]} alt="" fill className="object-cover" />
            </div>
        );
    }

    return (
        <div className="w-full aspect-square relative overflow-hidden">
            <Swiper
                slidesPerView={1}
                modules={[Navigation]}
                className="absolute inset-0 w-full h-full"
            >
                {images.map((img) => (
                    <SwiperSlide key={img}>
                        <Image src={img} alt="" fill className="object-cover" />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default ProductSlide;
