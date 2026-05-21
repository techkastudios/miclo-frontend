import { CiInstagram, CiFacebook, CiTwitter, CiYoutube } from "react-icons/ci";
import Image from "next/image";
import Link from "next/link";
import NewsLetterForm from "./NewsletterForm";
import { getNavigation } from "@/lib/api";

export async function Footer() {
    const navResult = await getNavigation("footer");
    const items = navResult.ok ? navResult.data.data.items : [];
    const copyrightResult = await getNavigation("copyright");
    const copyrightItems = copyrightResult.ok ? copyrightResult.data.data.items : [];

    return (
        <footer className="border-t border-border bg-surface">
            <div className="w-full px-4 md:px-8 py-14 md:py-20 grid grid-cols-12 gap-8">
                {/* Left 8 cols */}
                <div className="col-span-12 md:col-span-8 flex flex-col gap-8">
                    <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-6">
                        <Image
                            src="/assets/logo.png"
                            alt="MICLO"
                            className="w-auto"
                            style={{ maxWidth: "10rem" }}
                            width={160}
                            height={64}
                        />

                        <div className="flex items-baseline gap-4">
                            {[CiInstagram, CiFacebook, CiTwitter, CiYoutube].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    aria-label="Social"
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/30 text-foreground/70 transition-all hover:border-foreground hover:text-foreground"
                                    target="_blank"
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <nav className="flex flex-wrap gap-x-6 gap-y-3">
                        {items.map((item) => (
                            <Link
                                key={item.id}
                                href={item.url}
                                className="text-[11px] tracking-display uppercase text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Right 4 cols */}
                <div className="col-span-12 md:col-span-4 flex flex-col gap-5">
                    <h3 className="text-base md:text-lg font-light leading-snug max-w-xs">
                        Join our community for early access to new drops.
                    </h3>
                    <NewsLetterForm />
                </div>
            </div>

            <div className="border-t border-border">
                <div className="w-full px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] tracking-display uppercase text-muted-foreground">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <p>© 2026 MICLO. All rights reserved.</p>
                        {copyrightItems.map((item) => (
                            <a key={item.id} href={item.url} className="hover:text-foreground">
                                {item.label}
                            </a>
                        ))}
                    </div>
                    <p>
                        Designed and developed by{" "}
                        <a
                            href="https://techkastudios.com"
                            className="text-foreground hover:text-brand transition-colors"
                            target="_blank"
                        >
                            Techka Studios
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
