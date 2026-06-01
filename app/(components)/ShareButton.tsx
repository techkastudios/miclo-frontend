"use client";

import { useState } from "react";
import { CiLink, CiFacebook } from "react-icons/ci";
import { SiInstagram } from "react-icons/si";

interface ShareButtonProps {
    url: string;
    title: string;
}

export function ShareButton({ url, title }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback
        }
    };

    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

    const instagramUrl = `https://www.instagram.com/create/story/?url=${encodeURIComponent(url)}`;

    return (
        <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-display text-muted-foreground">Share</span>

            <button
                onClick={copyLink}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/30 text-foreground/70 transition-all hover:border-foreground hover:text-foreground"
                aria-label="Copy link"
            >
                <CiLink className="h-4 w-4" />
            </button>
            {copied && (
                <span className="text-[10px] text-brand uppercase tracking-display">Copied!</span>
            )}

            <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/30 text-foreground/70 transition-all hover:border-foreground hover:text-foreground"
                aria-label="Share on Facebook"
            >
                <CiFacebook className="h-4 w-4" />
            </a>

            <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/30 text-foreground/70 transition-all hover:border-foreground hover:text-foreground"
                aria-label="Share on Instagram"
            >
                <SiInstagram className="h-3.5 w-3.5" />
            </a>
        </div>
    );
}
