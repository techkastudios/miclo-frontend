'use client'
import { useEffect, useState } from "react";
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className={`group/header fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/90 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="flex w-full flex-col items-center gap-4 px-4 py-4 md:px-8 md:py-5">
        <div className="flex w-full items-center justify-between lg:justify-center">
          <button
            aria-label="Menu"
            className="lg:hidden text-foreground"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/" className="flex justify-center">
            <Image src="/assets/logo.png" alt="MICLO" width={140} height={56} />
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
          <button aria-label="Close" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col px-6 py-8 gap-6">
          {NAV.map((item) => (
            <Link
              key={item}
              href="#"
              onClick={() => setOpen(false)}
              className="text-sm tracking-display uppercase text-black"
            >
              {item}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
