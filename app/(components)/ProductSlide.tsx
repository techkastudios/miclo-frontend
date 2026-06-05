"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { CiImageOff } from "react-icons/ci";
import { Navigation } from "swiper/modules";
import "swiper/css";

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
        <div className="relative border border-border rounded-lg overflow-hidden">
            <Swiper
                slidesPerView={1}
                modules={[Navigation]}
                navigation={{
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                }}
                className="w-full"
            >
                {images.map((url) => (
                    <SwiperSlide key={url}>
                        <div className="w-full aspect-square relative">
                            <Image src={url} alt="" fill className="object-cover" />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <button
                type="button"
                className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 size-10 flex items-center justify-center rounded-full bg-white/80 shadow hover:bg-white transition-colors"
            >
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                    <path
                        d="M6 1L1 6L6 11"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                </svg>
            </button>
            <button
                type="button"
                className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10 size-10 flex items-center justify-center rounded-full bg-white/80 shadow hover:bg-white transition-colors"
            >
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                    <path
                        d="M1 1L6 6L1 11"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                </svg>
            </button>
        </div>
    );
}

export default ProductSlide;
