import { Hero } from "@/components/site/Hero";
import { getHeroBanner } from "@/lib/api";
import { BannerData } from "@/types";
const FALLBACK_HERO_SRC = "/assets/default-banner.jpeg";

const MOCK_VIDEO_BANNER: BannerData = {
    id: "mock-1",
    title: "Summer Sale",
    subtitle: "",
    description: "",
    image: "https://media.yourdomain.com/banners/desktop.jpg",
    mobile_image: "https://media.yourdomain.com/banners/mobile.jpg",
    video: {
        provider: "cloudflare",
        status: "ready",
        provider_playback_id: "abc123",
        thumbnail_url: "https://videodelivery.net/abc123/thumbnails/thumbnail.jpg",
        playback: {
            autoplay: true,
            muted: true,
            loop: true,
            show_controls: false,
        },
        stream: {
            hls: "https://videodelivery.net/abc123/manifest/video.m3u8",
            dash: "https://videodelivery.net/abc123/manifest/video.mpd",
            iframe: "https://iframe.videodelivery.net/abc123",
            thumbnail: "https://videodelivery.net/abc123/thumbnails/thumbnail.jpg",
        },
    },
    cta: {
        label: "",
        url: "",
        target: "_self",
        link_type: "custom",
    },
    position: "home_hero",
    sort_order: 1,
    starts_at: "",
    ends_at: "",
};

const useMockBanner = true;

export default async function HomeBanner() {
    if (useMockBanner) {
        return <Hero {...MOCK_VIDEO_BANNER} />;
    }

    const { data } = await getHeroBanner("home_hero", FALLBACK_HERO_SRC);

    return <Hero {...data} />;
}
