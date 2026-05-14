import { Suspense } from "react";
import { CiFacebook, CiInstagram, CiTwitter, CiYoutube } from "react-icons/ci";

import { StoresSection } from "./stores-section";
import { StoresSkeleton } from "./stores-skeleton";

const MAP_EMBED_SRC =
  "https://maps.google.com/maps?q=Metro+Shopping+Mall%2C+Mirpur+Road%2C+Dhanmondi%2C+Dhaka-1209&hl=en&z=17&ie=UTF8&iwloc=&output=embed";

const SOCIAL = [
  { Icon: CiInstagram, label: "Instagram", href: "#" },
  { Icon: CiFacebook, label: "Facebook", href: "#" },
  { Icon: CiTwitter, label: "Twitter", href: "#" },
  { Icon: CiYoutube, label: "YouTube", href: "#" },
] as const;

export default function ContactsPage() {
  return (
    <section className="py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-5">
        <div className="grid grid-cols-12 gap-x-8 gap-y-12 lg:gap-x-10">
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-10">
            <div className="flex flex-col gap-6">
              <h1 className="text-2xl font-light tracking-tight text-foreground md:text-3xl">
                Corporate Office
              </h1>
              <address className="not-italic flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                <p className="flex flex-col gap-1 text-foreground">
                  <span>Shop#104-105, Ground Floor,</span>
                  <span>Metro Shopping Mall, Mirpur Road,</span>
                  <span>Dhanmondi, Dhaka-1209</span>
                </p>
                <p>
                  <span className="sr-only">Phone</span>
                  <span className="font-medium text-foreground">T:</span>{" "}
                  <a
                    href="tel:+8801713286680"
                    className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    01713286680
                  </a>
                </p>
                <p>
                  <span className="sr-only">Email</span>
                  <span className="font-medium text-foreground">E:</span>{" "}
                  <a
                    href="mailto:contact@miclo.com"
                    className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    contact@miclo.com
                  </a>
                </p>
              </address>
            </div>

            <div>
              <p className="mb-3 text-[11px] font-medium uppercase tracking-display text-muted-foreground">
                Follow us
              </p>
              <div className="flex flex-wrap gap-2">
                {SOCIAL.map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-all hover:scale-105 hover:border-foreground/40 hover:bg-accent hover:text-foreground active:scale-95"
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8">
            <div className="aspect-4/3 w-full overflow-hidden rounded-xl border border-border bg-muted shadow-sm md:aspect-video lg:aspect-16/10">
              <iframe
                title="Metro Shopping Mall, Dhanmondi — map"
                src={MAP_EMBED_SRC}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        <Suspense fallback={<StoresSkeleton />}>
          <StoresSection />
        </Suspense>
      </div>
    </section>
  );
}
