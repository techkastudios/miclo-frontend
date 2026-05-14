'use client'
import { useCallback, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import Link from "next/link";
import Image from "next/image";

const NAV = [
  "New Arrivals",
  "Collections",
  "Womenswear",
  "Menswear",
  "Kids",
  "Accessories",
  "About us",
  "Contacts",
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const openMenu = useCallback(() => setOpen(true), []);
  const closeMenu = useCallback(() => setOpen(false), []);

  const onMenuTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLButtonElement>) => {
      e.preventDefault();
      openMenu();
    },
    [openMenu],
  );

  const onCloseTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLButtonElement>) => {
      e.preventDefault();
      closeMenu();
    },
    [closeMenu],
  );

  const onNavLinkTouchEnd = useCallback(() => {
    closeMenu();
  }, [closeMenu]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className={`group/header bg-background/90 fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-md border-b border-border" : ""
      }`}
    >
      <div className="flex w-full flex-col items-center gap-4 px-4 py-4 md:px-8 md:py-5">
        <div className="flex w-full items-center justify-between lg:justify-center">
          <button
            type="button"
            aria-label="Menu"
            className="lg:hidden touch-manipulation text-foreground relative"
            onClick={openMenu}
            onTouchEnd={onMenuTouchEnd}
          >
            <span className="absolute -inset-2 "></span>
            <Menu className="h-5 w-5" />
          </button>

          <Link
            href="/"
            className="relative isolate inline-flex justify-center overflow-hidden before:pointer-events-none before:absolute before:top-0 before:left-[-75%] before:z-1 before:block before:h-full before:w-[10%] before:-skew-x-[25deg] before:bg-white before:opacity-50 before:content-[''] before:animate-logo__animation"
          >
            <Image
              src="/assets/logo.png"
              alt="MICLO"
              width={140}
              height={56}
              className="relative z-0"
            />
          </Link>

          <div className="lg:hidden w-5" aria-hidden="true" />
        </div>

        <nav className="hidden lg:flex items-center justify-center gap-7 lg:gap-9">
          {NAV.map((item, i) => (
            <Link key={item} href="/contacts" className={`nav-link ${i === 0 ? "active" : ""}`}>
              {item}
            </Link>
          ))}
        </nav>
      </div>

      {/* Drawer menu */}
      <div
        className={`fixed inset-0 z-50 h-screen w-full bg-white text-black transition-transform duration-500 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-black/10">
          <Image src="/assets/logo.png" alt="MICLO" width={120} height={40} />
          <button
            type="button"
            aria-label="Close"
            className="touch-manipulation relative"
            onClick={closeMenu}
            onTouchEnd={onCloseTouchEnd}
          >
            <span className="absolute -inset-2 "></span>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col px-6 py-8 gap-6 max-h-[calc(100vh-4.375rem)] overflow-y-auto overflow-x-hidden">
          {NAV.map((item) => (
            <Link
              key={item}
              href="/contacts"
              onClick={closeMenu}
              onTouchEnd={onNavLinkTouchEnd}
              className="touch-manipulation text-sm tracking-display uppercase text-black"
            >
              {item}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
