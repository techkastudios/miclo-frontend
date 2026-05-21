"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import { useRef } from "react";
import Image from "next/image";

function ProductSlide({
    featuredImage,
    gallery,
    setShown,
}: {
    featuredImage: string;
    gallery: string[] | null;
    setShown: (arg: boolean) => void;
}) {
    const swiperRef = useRef<any>(null);

    return (
        <div className="fixed bg-background/15 backdrop-blur-sm inset-0 z-10">
            <div className="max-w-xl p-4 bg-background absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-2xl">
                <div className="flex items-center justify-between">
                    <button
                        className="btn-outline mb-4 rounded-full px-3! py-2!"
                        onClick={() => {
                            setShown(false);

                            document
                                .getElementsByTagName("body")[0]
                                .classList.remove("overflow-hidden");
                        }}
                    >
                        X
                    </button>

                    {gallery && gallery.length > 0 && (
                        <div className="flex justify-end items-center gap-4">
                            <div className="flex items-center gap-4">
                                <button
                                    className="rounded-full bg-transparent hover:text-black cursor-pointer btn-outline"
                                    onClick={() => swiperRef.current?.slidePrev()}
                                >
                                    <ArrowLeft />
                                </button>
                                <button
                                    className="rounded-full bg-transparent hover:text-black cursor-pointer btn-outline"
                                    onClick={() => swiperRef.current?.slideNext()}
                                >
                                    <ArrowRight />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                {gallery && gallery.length > 0 ? (
                    <>
                        <Swiper
                            slidesPerView={1}
                            modules={[Navigation]}
                            onSwiper={(swiper) => {
                                swiperRef.current = swiper;
                            }}
                            className="mt-6"
                        >
                            {gallery.map((img) => (
                                <SwiperSlide key={img}>
                                    <Image
                                        src={img}
                                        alt=""
                                        loading="lazy"
                                        width={500}
                                        height={500}
                                        className="w-full h-125"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </>
                ) : (
                    <Image
                        src={featuredImage}
                        alt=""
                        loading="lazy"
                        width={500}
                        height={500}
                        className="aspect-square"
                    />
                )}
            </div>
        </div>
    );
}

export default ProductSlide;
