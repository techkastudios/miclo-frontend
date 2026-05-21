import Image from "next/image";
import { cn } from "@/lib/utils";
import { BannerData } from "@/types";

// const FALLBACK_HERO_SRC = "/assets/hero.jpg";

export async function Hero({ title, subtitle, cta, image }: BannerData) {
    const alt = title?.trim() || "MICLO new arrivals campaign";
    return (
        <section className="relative h-[max(240px,calc(100svh-var(--site-header-height)))] lg:h-[max(640px,calc(100svh-var(--site-header-height)))] lg:min-h-[max(640px,calc(100svh-var(--site-header-height)))] w-full overflow-hidden">
            <Image
                src={image}
                alt={alt}
                fill
                className="object-cover object-top"
                sizes="100vw"
                priority
            />
            {/* Cinematic gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60" />

            <div className="relative z-10 flex h-full flex-col items-center justify-end pb-20 md:pb-28 px-6 text-center">
                {/* <p className="animate-fade-in text-[11px] tracking-wider-2 uppercase text-white/80 mb-4">
          Spring / Summer 26
        </p> */}
                {title && (
                    <h1 className="animate-fade-up text-white font-light tracking-display uppercase text-4xl md:text-6xl lg:text-7xl mb-10 max-w-xs md:max-w-4xl leading-[1.05]">
                        {title} <span className="italic font-extralight">{subtitle}</span>
                    </h1>
                )}
                {cta && cta.label && (
                    <a
                        href={cta.url || "/"}
                        className={cn("animate-fade-up btn-outline not-dark:invert")}
                        style={{ animationDelay: "0.3s" }}
                    >
                        {cta.label}
                    </a>
                )}
            </div>
        </section>
    );
}
