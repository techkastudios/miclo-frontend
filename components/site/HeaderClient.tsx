"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import type { HeaderNavLink } from "@/lib/header-navigation";

function navLinkTarget(target: string): "_blank" | undefined {
  return target === "_blank" ? "_blank" : undefined;
}

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/" || href === "") {
    return pathname === "/";
  }
  if (pathname === href) {
    return true;
  }
  return pathname.startsWith(`${href}/`);
}

function NavAnchor({
  link,
  pathname,
  className,
  onNavigate,
}: {
  link: HeaderNavLink;
  pathname: string;
  className: string;
  onNavigate?: () => void;
}) {
  const active = isNavActive(pathname, link.url);
  const target = navLinkTarget(link.target);
  const rel = target === "_blank" ? "noopener noreferrer" : undefined;

  return (
    <Link
      href={link.url}
      target={target}
      rel={rel}
      onClick={onNavigate}
      className={`${className}${active ? " active" : ""}`}
    >
      {link.label}
    </Link>
  );
}

export function HeaderClient({ links }: { links: HeaderNavLink[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const openMenu = () => setOpen(true);
  const closeMenu = () => setOpen(false);

  const drawer = (
    <div
      className="fixed inset-0 z-100 flex h-dvh w-full bg-white text-black lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <div className="flex h-full min-h-0 w-full flex-col">
        <div className="flex shrink-0 items-center justify-between border-b border-black/10 px-4 py-4">
          <Image src="/assets/logo.png" alt="MICLO" width={120} height={40} />
          <button
            type="button"
            aria-label="Close menu"
            className="flex min-h-11 min-w-11 cursor-pointer touch-manipulation items-center justify-center"
            onClick={closeMenu}
          >
            <X className="pointer-events-none h-5 w-5" aria-hidden />
          </button>
        </div>
        <nav className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto overflow-x-hidden px-6 py-8">
          {links.length === 0 ? (
            <p className="text-sm text-black/50">Loading menu…</p>
          ) : (
            links.map((link) => (
              <NavAnchor
                key={link.id}
                link={link}
                pathname={pathname}
                onNavigate={closeMenu}
                className="touch-manipulation py-1 text-sm tracking-display uppercase text-black"
              />
            ))
          )}
        </nav>
      </div>
    </div>
  );

  return (
    <header
      data-scrolled={scrolled}
      className={`group/header isolate bg-background/90 fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-md border-b border-border" : ""
      }`}
    >
      <div className="relative z-10 flex w-full flex-col items-center gap-4 px-4 py-4 md:px-8 md:py-5">
        <div className="flex w-full items-center justify-between lg:justify-center">
          <button
            type="button"
            aria-label="Open menu"
            className="relative z-20 flex min-h-11 min-w-11 shrink-0 cursor-pointer touch-manipulation items-center justify-center text-foreground lg:hidden"
            onClick={openMenu}
          >
            <Menu className="pointer-events-none h-5 w-5 shrink-0" aria-hidden />
          </button>

          <Link
            href="/"
            className="relative z-0 isolate inline-flex justify-center overflow-hidden before:pointer-events-none before:absolute before:top-0 before:left-[-75%] before:z-1 before:block before:h-full before:w-[10%] before:-skew-x-[25deg] before:bg-white before:opacity-50 before:content-[''] before:animate-logo__animation"
          >
            <Image
              src="/assets/logo.png"
              alt="MICLO"
              width={140}
              height={56}
              className="relative z-0"
            />
          </Link>

          <div className="lg:hidden w-5 shrink-0" aria-hidden="true" />
        </div>

        <nav className="hidden items-center justify-center gap-7 lg:flex lg:gap-9">
          {links.map((link) => (
            <NavAnchor
              key={link.id}
              link={link}
              pathname={pathname}
              className="nav-link"
            />
          ))}
        </nav>
      </div>

      {open && typeof document !== "undefined" ? createPortal(drawer, document.body) : null}
    </header>
  );
}
