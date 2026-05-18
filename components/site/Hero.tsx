import Image from "next/image";

import { apiFetchJson, getPublicApiBaseUrl } from "@/lib/api";
import { cn } from "@/lib/utils";

const FALLBACK_HERO_SRC = "/assets/hero.jpg";

type BannerCta = {
  label: string | null;
  url: string | null;
  target?: string;
};

type Banner = {
  id: string;
  title: string | null;
  subtitle: string | null;
  image: string | null;
  mobile_image?: string | null;
  position: string;
  sort_order: number;
  cta: BannerCta;
};

type BannersResponse = {
  success: boolean;
  data: Banner[];
};

function isBannersResponse(data: unknown): data is BannersResponse {
  if (!data || typeof data !== "object") return false;
  const o = data as Record<string, unknown>;
  return o.success === true && Array.isArray(o.data);
}

function resolveBannerImageUrl(path: string | null | undefined): string | null {
  if (!path?.trim()) return null;
  const base = getPublicApiBaseUrl();
  const trimmed = path.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const relative = trimmed.replace(/^\//, "");
  if (relative.startsWith("storage/")) {
    return `${base}/${relative}`;
  }
  return `${base}/storage/${relative}`;
}

async function getHomeHeroBanner(): Promise<Banner> {
  const fallback = {
    id: "1",
    title: "The new",
    subtitle: "arrivals",
    image: FALLBACK_HERO_SRC,
    position: "home_hero",
    sort_order: 0,
    cta: {
      label: "New Arrivals",
      url: "/collection/new-arrivals",
    }
  };

  try {
    const result = await apiFetchJson<BannersResponse>("/api/v1/banners", {
      next: { revalidate: 60 },
      validate: isBannersResponse,
    });

    if (!result.ok) return fallback;

    const json = result.data;
    const sorted = [...json.data].sort((a, b) => a.sort_order - b.sort_order);
    const banner =
      sorted.find((b) => b.position === "home_hero") ?? sorted[0] ?? null;

    const resolved = resolveBannerImageUrl(
      banner?.image ?? banner?.mobile_image ?? null
    );

    if (!resolved) return fallback;

    return {
      ...banner,
      image: resolved
    };
  } catch {
    return fallback;
  }
}

export async function Hero() {
  const {title, subtitle, cta, image } = await getHomeHeroBanner();
  const alt = title?.trim() || "MICLO new arrivals campaign"
  return (
    <section className="relative h-[max(640px,calc(100svh-var(--site-header-height)))] min-h-[max(640px,calc(100svh-var(--site-header-height)))] w-full overflow-hidden">
      <Image
        src={image || FALLBACK_HERO_SRC}
        alt={alt}
        fill
        className="object-cover object-top"
        sizes="100vw"
        priority
      />
      {/* Cinematic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60" />

      <div className="relative z-10 flex h-full flex-col items-center justify-end pb-20 md:pb-28 px-6 text-center">
        <p className="animate-fade-in text-[11px] tracking-wider-2 uppercase text-white/80 mb-4">
          Spring / Summer 26
        </p>
        <h1 className="animate-fade-up text-white font-light tracking-display uppercase text-4xl md:text-6xl lg:text-7xl mb-10 max-w-4xl leading-[1.05]">
          {title} <span className="italic font-extralight">{subtitle}</span>
        </h1>
        <a href={cta.url || "/"} className={cn("animate-fade-up btn-outline not-dark:invert")} style={{ animationDelay: "0.3s" }}>
          {cta.label}
        </a>
      </div>
    </section>
  );
}
