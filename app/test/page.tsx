"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

// import "swiper/css";

const demoImages = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1470071459604-7b8ec44ffd0a?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=800&fit=crop",
];

export default function TestPage() {
    return (
        <div className="max-w-lg mx-auto p-6">
            <h1 className="text-lg font-semibold mb-4">Swiper Test</h1>

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
                    {demoImages.map((url) => (
                        <SwiperSlide key={url}>
                            <Image
                                src={url}
                                alt=""
                                width={800}
                                height={800}
                                className="w-full object-cover"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                <button
                    type="button"
                    className="swiper-button-prev absolute left-2 top-1/2 -translate-y-1/2 z-10 size-10 flex items-center justify-center rounded-full bg-white/80 shadow hover:bg-white transition-colors"
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
                    className="swiper-button-next absolute right-2 top-1/2 -translate-y-1/2 z-10 size-10 flex items-center justify-center rounded-full bg-white/80 shadow hover:bg-white transition-colors"
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
        </div>
    );
}
