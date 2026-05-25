"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import type { HeaderNavLink } from "@/lib/header-navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DropdownProduct {
    id: string;
    name: string;
    image: string;
    href: string;
}

interface DropdownData {
    /** Always exactly 3: All items, New Arrivals, Collections */
    baseHref: string;
    products: DropdownProduct[];
}

// ─── Per-nav dropdown config ──────────────────────────────────────────────────

const DROPDOWN_CONFIG: Record<string, DropdownData> = {
    Womenswear: {
        baseHref: "/womenswear",
        products: [
            {
                id: "wp1",
                name: "Linen Shirt",
                image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80",
                href: "/womenswear/shirts/linen-shirt",
            },
            {
                id: "wp2",
                name: "Relaxed Trousers",
                image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80",
                href: "/womenswear/bottoms/relaxed-trousers",
            },
            {
                id: "wp3",
                name: "Denim Jacket",
                image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&q=80",
                href: "/womenswear/denim/jacket",
            },
            {
                id: "wp4",
                name: "Wrap Dress",
                image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80",
                href: "/womenswear/dresses/wrap-dress",
            },
        ],
    },
    Menswear: {
        baseHref: "/menswear",
        products: [
            {
                id: "mp1",
                name: "Oxford Shirt",
                image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80",
                href: "/menswear/shirts/oxford",
            },
            {
                id: "mp2",
                name: "Slim Chinos",
                image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80",
                href: "/menswear/bottoms/chinos",
            },
            {
                id: "mp3",
                name: "Raw Denim",
                image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80",
                href: "/menswear/denim/raw",
            },
            {
                id: "mp4",
                name: "Coach Jacket",
                image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80",
                href: "/menswear/outer/coach-jacket",
            },
        ],
    },
    Kids: {
        baseHref: "/kids",
        products: [
            {
                id: "kp1",
                name: "Striped Tee",
                image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400&q=80",
                href: "/kids/tops/striped-tee",
            },
            {
                id: "kp2",
                name: "Cargo Shorts",
                image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&q=80",
                href: "/kids/bottoms/cargo-shorts",
            },
            {
                id: "kp3",
                name: "Hoodie",
                image: "https://images.unsplash.com/photo-1509087859087-a384654eca4d?w=400&q=80",
                href: "/kids/outer/hoodie",
            },
            {
                id: "kp4",
                name: "Puffer Vest",
                image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&q=80",
                href: "/kids/outer/puffer-vest",
            },
        ],
    },
    Accessories: {
        baseHref: "/accessories",
        products: [
            {
                id: "ap1",
                name: "Canvas Tote",
                image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
                href: "/accessories/bags/canvas-tote",
            },
            {
                id: "ap2",
                name: "Bucket Hat",
                image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400&q=80",
                href: "/accessories/hats/bucket-hat",
            },
            {
                id: "ap3",
                name: "Wool Scarf",
                image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&q=80",
                href: "/accessories/scarves/wool",
            },
            {
                id: "ap4",
                name: "Leather Belt",
                image: "https://images.unsplash.com/photo-1624222247344-550fb60fe8ff?w=400&q=80",
                href: "/accessories/belts/leather",
            },
        ],
    },
    Collections: {
        baseHref: "/collections",
        products: [
            {
                id: "cp1",
                name: "SS25 Look 01",
                image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80",
                href: "/collections/ss25/look-01",
            },
            {
                id: "cp2",
                name: "SS25 Look 02",
                image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80",
                href: "/collections/ss25/look-02",
            },
            {
                id: "cp3",
                name: "FW24 Look 01",
                image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80",
                href: "/collections/fw24/look-01",
            },
            {
                id: "cp4",
                name: "FW24 Look 02",
                image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80",
                href: "/collections/fw24/look-02",
            },
        ],
    },
    "New Arrivals": {
        baseHref: "/new-arrivals",
        products: [
            {
                id: "nap1",
                name: "Gauze Shirt",
                image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&q=80",
                href: "/new-arrivals/gauze-shirt",
            },
            {
                id: "nap2",
                name: "Pleated Skirt",
                image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80",
                href: "/new-arrivals/pleated-skirt",
            },
            {
                id: "nap3",
                name: "Knit Cardigan",
                image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80",
                href: "/new-arrivals/knit-cardigan",
            },
            {
                id: "nap4",
                name: "Wide Trousers",
                image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&q=80",
                href: "/new-arrivals/wide-trousers",
            },
        ],
    },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function navLinkTarget(target: string): "_blank" | undefined {
    return target === "_blank" ? "_blank" : undefined;
}

function isNavActive(pathname: string, href: string): boolean {
    if (href === "/" || href === "") return pathname === "/";
    if (pathname === href) return true;
    return pathname.startsWith(`${href}/`);
}

// ─── Full-width Mega Dropdown ─────────────────────────────────────────────────

function MegaDropdown({
    label,
    data,
    visible,
    onMouseEnter,
    onMouseLeave,
}: {
    label: string;
    data: DropdownData;
    visible: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}) {
    return (
        <div
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={`fixed left-0 right-0 bg-white border-b border-black/10 shadow-lg transition-all duration-200 z-40 ${
                visible
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-1 pointer-events-none"
            }`}
            /* top is set inline so it sits exactly below the header — see HeaderClient */
            style={{ top: "var(--header-height, 105px)" }}
        >
            <div className="flex w-full">
                {/* Left: always exactly 3 links */}
                <div className="w-52 shrink-0 border-r border-black/10 py-8 px-8 flex flex-col gap-3">
                    <Link
                        href={data.baseHref}
                        className="block text-sm font-bold tracking-widest uppercase text-black hover:text-red-600 transition-colors duration-150 py-0.5"
                    >
                        All items
                    </Link>
                    <Link
                        href={`${data.baseHref}/new-arrivals`}
                        className="block text-sm tracking-widest uppercase text-black/60 hover:text-red-600 transition-colors duration-150 py-0.5"
                    >
                        New Arrivals
                    </Link>
                    <Link
                        href={`${data.baseHref}/collections`}
                        className="block text-sm tracking-widest uppercase text-black/60 hover:text-red-600 transition-colors duration-150 py-0.5"
                    >
                        Collections
                    </Link>
                </div>

                {/* Right: featured products — fills remaining width */}
                <div className="flex-1 py-8 px-8">
                    <p className="text-[10px] tracking-[0.22em] uppercase text-black/35 mb-5">
                        Featured
                    </p>
                    <div className="grid grid-cols-4 gap-5 xl:grid-cols-6 2xl:grid-cols-8">
                        {data.products.map((product) => (
                            <Link
                                key={product.id}
                                href={product.href}
                                className="group/product block"
                            >
                                <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-100 mb-2">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover/product:scale-105"
                                    />
                                </div>
                                <p className="text-[10px] tracking-[0.15em] uppercase text-black/60 group-hover/product:text-red-600 transition-colors duration-150">
                                    {product.name}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
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
    const dropdownData = DROPDOWN_CONFIG[link.label];
    const [subOpen, setSubOpen] = useState(false);

    if (!dropdownData) {
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
                        href={dropdownData.baseHref}
                        onClick={onNavigate}
                        className="text-xs tracking-widest uppercase font-bold text-black hover:text-red-600 py-0.5 transition-colors"
                    >
                        All items
                    </Link>
                    <Link
                        href={`${dropdownData.baseHref}/new-arrivals`}
                        onClick={onNavigate}
                        className="text-xs tracking-widest uppercase text-black/60 hover:text-red-600 py-0.5 transition-colors"
                    >
                        New Arrivals
                    </Link>
                    <Link
                        href={`${dropdownData.baseHref}/collections`}
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
    const headerRef = useRef<HTMLElement>(null);
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
                            const hasDropdown = !!DROPDOWN_CONFIG[link.label];
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
                const data = DROPDOWN_CONFIG[link.label];
                if (!data) return null;
                return (
                    <MegaDropdown
                        key={link.id}
                        label={link.label}
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
