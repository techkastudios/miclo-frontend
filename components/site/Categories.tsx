import Image from "next/image";

import { apiFetchJson, getPublicApiBaseUrl } from "@/lib/api";
import { cn } from "@/lib/utils";

type Cat = { title: string; img: string; href: string };

const FALLBACK_CATS: Cat[] = [
  { title: "Womenswear", img: "/assets/cat-women.jpg", href: "#" },
  { title: "Menswear", img: "/assets/cat-men.jpg", href: "#" },
  { title: "Kidswear", img: "/assets/cat-kids.jpg", href: "#" },
  { title: "Accessories", img: "/assets/cat-accessories.jpg", href: "#" },
  { title: "Winter Collection", img: "/assets/cat-winter.jpg", href: "#" },
];

type FeaturedCategory = {
  id: string;
  name: string;
  slug: string;
  image: string;
  sort_order: number;
};

type FeaturedCategoriesResponse = {
  success: boolean;
  data: FeaturedCategory[];
};

function isFeaturedCategoriesResponse(
  data: unknown
): data is FeaturedCategoriesResponse {
  if (!data || typeof data !== "object") return false;
  const o = data as Record<string, unknown>;
  if (o.success !== true || !Array.isArray(o.data)) return false;
  return o.data.every(
    (item) =>
      item &&
      typeof item === "object" &&
      typeof (item as FeaturedCategory).name === "string" &&
      typeof (item as FeaturedCategory).slug === "string" &&
      typeof (item as FeaturedCategory).image === "string" &&
      typeof (item as FeaturedCategory).sort_order === "number"
  );
}

function resolveCategoryImageUrl(path: string | null | undefined): string | null {
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

function mapApiCategory(c: FeaturedCategory): Cat | null {
  const img = resolveCategoryImageUrl(c.image);
  if (!img) return null;
  return {
    title: c.name,
    img,
    href: `${c.slug}`,
  };
}

async function getFeaturedCategories(): Promise<Cat[]> {
  try {
    const result = await apiFetchJson<FeaturedCategoriesResponse>(
      "/api/v1/categories/featured",
      {
        next: { revalidate: 60 },
        validate: isFeaturedCategoriesResponse,
      }
    );

    if (!result.ok) return FALLBACK_CATS;

    const sorted = [...result.data.data].sort(
      (a, b) => a.sort_order - b.sort_order
    );
    const mapped = sorted
      .map(mapApiCategory)
      .filter((c): c is Cat => c !== null);

    return mapped.length > 0 ? mapped : FALLBACK_CATS;
  } catch {
    return FALLBACK_CATS;
  }
}

function Tile({ cat, className = "" }: { cat: Cat; className?: string }) {
  return (
    <a
      href={cat.href}
      className={`group relative block overflow-hidden bg-surface ${className}`}
    >
      <Image
        src={cat.img}
        alt={cat.title}
        loading="lazy"
        className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
        fill={true}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute inset-x-0 bottom-6 md:bottom-10 flex justify-center">
        <span className={cn("btn-outline not-dark:invert")}>{cat.title}</span>
      </div>
    </a>
  );
}

export async function Categories() {
  const cats = await getFeaturedCategories();

  console.log("Categories res: ", cats);
  

  const [top0, top1, mid0, mid1, ...tail] = cats;

  return (
    <section id="collections" className="bg-background">
      <div className="w-full px-4 md:px-5 py-16 md:py-24">
        {(top0 || top1) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {top0 && (
              <Tile
                cat={top0}
                className="aspect-4/2.5"
              />
            )}
            {top1 && (
              <Tile
                cat={top1}
                className="aspect-4/2.5"
              />
            )}
          </div>
        )}
        {(mid0 || mid1) && (
          <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-fr gap-3 md:gap-4 mt-3 md:mt-4">
            {mid0 && (
              <Tile
                cat={mid0}
                className="aspect-2 md:h-full"
              />
            )}
            {mid1 && (
              <Tile
                cat={mid1}
                className="aspect-4/1.75 md:h-full md:col-span-2"
              />
            )}
          </div>
        )}
        {tail.map((cat) => (
          <div key={cat.href + cat.title} className="mt-3 md:mt-4">
            <Tile cat={cat} className="aspect-2/0.75" />
          </div>
        ))}
      </div>
    </section>
  );
}
