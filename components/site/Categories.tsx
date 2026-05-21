import Image from "next/image";

import { getFeaturedCategories, getPublicApiBaseUrl } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Cat } from "@/types";

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
