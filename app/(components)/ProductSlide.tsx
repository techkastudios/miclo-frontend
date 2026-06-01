"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

function ProductSlide({
    featuredImage,
    gallery,
}: {
    featuredImage: string;
    gallery: string[] | null;
}) {
    const images = gallery && gallery.length > 0 ? [featuredImage, ...gallery] : [featuredImage];

    return (
        <>
            {images.length > 1 ? (
                <Swiper slidesPerView={1} modules={[Navigation]}>
                    {images.map((img) => (
                        <SwiperSlide key={img}>
                            <Image
                                src={img}
                                alt=""
                                width={800}
                                height={800}
                                className="aspect-square"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <Image
                    src={featuredImage}
                    alt=""
                    width={800}
                    height={800}
                    className="aspect-square"
                />
            )}
        </>
    );
}

export default ProductSlide;
