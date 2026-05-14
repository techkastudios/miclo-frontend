import { CiInstagram as IgIcon } from "react-icons/ci";
import Image from "next/image";
import { cn } from "@/lib/utils";

const IMAGES = ["/assets/ig-1.jpg", "/assets/ig-2.jpg", "/assets/ig-3.jpg", "/assets/ig-4.jpg", "/assets/ig-5.jpg", "/assets/ig-6.jpg", "/assets/ig-7.jpg", "/assets/ig-8.jpg"];

export function Instagram() {
  return (
    <section className="bg-background">
      <div className="w-full px-4 md:px-5 pb-16 md:pb-24">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-[11px] tracking-wider-2 uppercase text-muted-foreground mb-3">@miclo.studio</p>
          <h2 className="text-2xl md:text-4xl font-light tracking-display uppercase">
            On <span className="italic">Instagram</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {IMAGES.map((src, i) => (
            <a
              key={i}
              href="#"
              className="group relative block aspect-square overflow-hidden bg-surface"
              aria-label={`Instagram post ${i + 1}`}
            >
              <Image
                src={src}
                alt=""
                loading="lazy"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                fill={true}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 opacity-0 transition-all duration-300 group-hover:bg-foreground/40 group-hover:opacity-100">
                <IgIcon className="h-6 w-6 text-white" />
              </div>
            </a>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <a href="#" className={cn("btn-outline")}>
            Find us on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
