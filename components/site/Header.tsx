import { Suspense } from "react";

import { fetchHeaderNavLinks } from "@/lib/header-navigation";

import { HeaderClient } from "./HeaderClient";

export function HeaderFallback() {
  return (
    <header className="group/header bg-background/90 fixed inset-x-0 top-0 z-50 transition-all duration-500">
      <div className="relative z-10 flex w-full flex-col items-center gap-4 px-4 py-4 md:px-8 md:py-5">
        <div className="flex w-full items-center justify-between lg:justify-center">
          <div className="min-h-11 min-w-11 lg:hidden" aria-hidden />
          <div className="h-14 w-[140px] animate-pulse rounded bg-foreground/10" />
          <div className="min-h-11 min-w-11 lg:hidden" aria-hidden />
        </div>
        <div className="hidden h-5 gap-9 lg:flex">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-3 w-16 animate-pulse rounded bg-foreground/10" />
          ))}
        </div>
      </div>
    </header>
  );
}

async function HeaderWithData() {
  const links = await fetchHeaderNavLinks();
  return <HeaderClient links={links} />;
}

export function Header() {
  return (
    <Suspense fallback={<HeaderFallback />}>
      <HeaderWithData />
    </Suspense>
  );
}
