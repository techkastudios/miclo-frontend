"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { getProducts } from "@/lib/api";
import type { HeaderNavLink } from "@/lib/header-navigation";
import { MegaDropdown } from "./MegaDropdown";
import type { DropdownData, DropdownProduct } from "./MegaDropdown";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function navLinkTarget(target: string): "_blank" | undefined {
    return target === "_blank" ? "_blank" : undefined;
}

function isNavActive(pathname: string, href: string): boolean {
    if (href === "/" || href === "") return pathname === "/";
    if (pathname === href) return true;
    return pathname.startsWith(`${href}/`);
}

// ─── NavAnchor ────────────────────────────────────────────────────────────────

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

// ─── Mobile drawer link ───────────────────────────────────────────────────────

function MobileNavItem({
    link,
    pathname,
    onNavigate,
}: {
    link: HeaderNavLink;
    pathname: string;
    onNavigate: () => void;
}) {
    const baseHref = link.url && link.url !== "/" ? link.url : null;
    const [subOpen, setSubOpen] = useState(false);

    if (!baseHref) {
        return (
            <NavAnchor
                link={link}
                pathname={pathname}
                onNavigate={onNavigate}
                className="touch-manipulation py-1 text-sm tracking-display uppercase text-black"
            />
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <NavAnchor
                    link={link}
                    pathname={pathname}
                    onNavigate={onNavigate}
                    className="touch-manipulation py-1 text-sm tracking-display uppercase text-black flex-1"
                />
                <button
                    type="button"
                    aria-label={`${subOpen ? "Collapse" : "Expand"} ${link.label} sub-menu`}
                    onClick={() => setSubOpen((v) => !v)}
                    className="flex min-h-10 min-w-10 items-center justify-center text-black/50 transition-transform duration-200"
                    style={{ transform: subOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                >
                    <ChevronRight className="h-4 w-4 pointer-events-none" aria-hidden />
                </button>
            </div>

            <div
                className={`overflow-hidden transition-all duration-300 ${
                    subOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="flex flex-col gap-2 pl-4 pt-2 pb-3 border-l border-black/10 ml-1">
                    <Link
                        href={baseHref}
                        onClick={onNavigate}
                        className="text-xs tracking-widest uppercase font-bold text-black hover:text-red-600 py-0.5 transition-colors"
                    >
                        All items
                    </Link>
                    <Link
                        href={`${baseHref}/new-arrivals`}
                        onClick={onNavigate}
                        className="text-xs tracking-widest uppercase text-black/60 hover:text-red-600 py-0.5 transition-colors"
                    >
                        New Arrivals
                    </Link>
                    <Link
                        href={`${baseHref}/collections`}
                        onClick={onNavigate}
                        className="text-xs tracking-widest uppercase text-black/60 hover:text-red-600 py-0.5 transition-colors"
                    >
                        Collections
                    </Link>
                </div>
            </div>
        </div>
    );
}

// ─── HeaderClient ─────────────────────────────────────────────────────────────

export function HeaderClient({ links }: { links: HeaderNavLink[] }) {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [categoryData, setCategoryData] = useState<Record<string, DropdownData>>({});
    const headerRef = useRef<HTMLElement>(null);
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Fetch products when a dropdown becomes active
    useEffect(() => {
        if (!activeDropdown) return;
        if (categoryData[activeDropdown]) return;

        const link = links.find((l) => l.label === activeDropdown);
        if (!link || !link.url || link.url === "/") return;

        // const slug = link.url.replace(/^\//, "");
        const slug = link.url.split("/")[2];

        getProducts({ category: slug, perPage: 7 }).then((result) => {
            if (!result.ok) return;
            const products: DropdownProduct[] = result.data.data.map((p) => ({
                id: p.id,
                name: p.name,
                image: p.featured_image,
                href: `/products/${p.slug}`,
            }));
            setCategoryData((prev) => ({
                ...prev,
                [activeDropdown]: { baseHref: link.url, products },
            }));
        });
    }, [activeDropdown, links, categoryData]);

    // Track header height so the full-width dropdown can sit flush below it
    const [headerHeight, setHeaderHeight] = useState(105);
    useEffect(() => {
        if (!headerRef.current) return;
        const ro = new ResizeObserver(() => {
            setHeaderHeight(headerRef.current?.offsetHeight ?? 105);
        });
        ro.observe(headerRef.current);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (!mobileOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [mobileOpen]);

    const openDropdown = (label: string) => {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        setActiveDropdown(label);
    };
    const scheduleClose = () => {
        closeTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 120);
    };
    const cancelClose = () => {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };

    const openMenu = () => setMobileOpen(true);
    const closeMenu = () => setMobileOpen(false);

    const drawer = (
        <div
            className={`fixed inset-0 z-100 transition-opacity duration-300 lg:hidden ${
                mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
        >
            <div className="fixed inset-0 bg-black/50" onClick={closeMenu} aria-hidden="true" />
            <div
                className={`absolute left-0 top-0 h-full w-full max-w-sm bg-white text-black shadow-xl transition-transform duration-300 ${
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                }`}
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
                    <nav className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden px-6 py-8">
                        {links.length === 0 ? (
                            <p className="text-sm text-black/50">Loading menu…</p>
                        ) : (
                            links.map((link) => (
                                <MobileNavItem
                                    key={link.id}
                                    link={link}
                                    pathname={pathname}
                                    onNavigate={closeMenu}
                                />
                            ))
                        )}
                    </nav>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <header
                ref={headerRef}
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

                    {/* Desktop nav */}
                    <nav className="hidden items-center justify-center gap-7 lg:flex lg:gap-9">
                        {links.map((link) => {
                            const hasDropdown = !!(link.url && link.url !== "/");
                            return (
                                <div
                                    key={link.id}
                                    onMouseEnter={() =>
                                        hasDropdown ? openDropdown(link.label) : scheduleClose()
                                    }
                                    onMouseLeave={scheduleClose}
                                >
                                    <NavAnchor
                                        link={link}
                                        pathname={pathname}
                                        className="nav-link"
                                    />
                                </div>
                            );
                        })}
                    </nav>
                </div>

                {drawer}
            </header>

            {/* Full-width mega dropdowns — rendered outside <header> so they can span 100vw freely */}
            {links.map((link) => {
                const data = categoryData[link.label];
                if (!link.url || link.url === "/" || !data) return null;
                return (
                    <MegaDropdown
                        key={link.id}
                        data={data}
                        visible={activeDropdown === link.label}
                        onMouseEnter={() => {
                            cancelClose();
                            setActiveDropdown(link.label);
                        }}
                        onMouseLeave={scheduleClose}
                    />
                );
            })}
            {/* Backdrop that closes dropdown when clicking page content */}
            {activeDropdown && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => setActiveDropdown(null)}
                    aria-hidden="true"
                />
            )}
        </>
    );
}
