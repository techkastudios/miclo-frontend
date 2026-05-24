import Image from "next/image";
import { cn } from "@/lib/utils";
import { BannerData } from "@/types";

export async function Hero({ title, subtitle, cta, image, video }: BannerData) {
    const alt = title?.trim() || "MICLO new arrivals campaign";
    const showVideo = video && video.status === "ready" && video.stream?.hls;
    return (
        <section className="relative h-[max(240px,calc(100svh-var(--site-header-height)))] lg:h-[max(640px,calc(100svh-var(--site-header-height)))] lg:min-h-[max(640px,calc(100svh-var(--site-header-height)))] w-full overflow-hidden">
            {showVideo ? (
                <video
                    src={video.stream.hls}
                    poster={video.thumbnail_url || image}
                    autoPlay={video.playback.autoplay}
                    muted={video.playback.muted}
                    loop={video.playback.loop}
                    controls={video.playback.show_controls}
                    playsInline
                    className="absolute inset-0 size-full object-cover object-top"
                />
            ) : (
                <Image
                    src={image}
                    alt={alt}
                    fill
                    className="object-cover object-top"
                    sizes="100vw"
                    priority
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60" />

            <div className="relative z-10 flex h-full flex-col items-center justify-end pb-20 md:pb-28 px-6 text-center">
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
