import { Hero } from "@/components/site/Hero";
import { getHeroBanner } from "@/lib/api";
import { BannerData, BannerVideo } from "@/types";
const FALLBACK_HERO_SRC = "/assets/default-banner.jpeg";

const MOCK_BANNER: BannerData = {
    id: "mock-1",
    title: "Summer Sale",
    subtitle: "",
    description: "",
    image: FALLBACK_HERO_SRC,
    mobile_image: FALLBACK_HERO_SRC,
    cta: {
        label: "New Arrivals",
        url: "/new-arrivals",
        target: "_self",
        link_type: "custom",
    },
    position: "home_hero",
    sort_order: 1,
    starts_at: "",
    ends_at: "",
};

const MOCK_VIDEO: BannerVideo = {
    provider: "local",
    status: "ready",
    provider_playback_id: "",
    thumbnail_url: "",
    playback: {
        autoplay: true,
        muted: true,
        loop: true,
        show_controls: false,
    },
    stream: {
        hls: "/videos/home-hero-vid.mp4",
        dash: "",
        iframe: "",
        thumbnail: "",
    },
};

const useMockBanner = true;

export default async function HomeBanner() {
    if (useMockBanner) {
        return <Hero {...MOCK_BANNER} video={MOCK_VIDEO} />;
    }

    const { data } = await getHeroBanner("home_hero", FALLBACK_HERO_SRC);

    return <Hero {...data} />;
}
