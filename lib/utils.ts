import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getPublicApiBaseUrl } from "@/lib/api";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}


export function resolvePublicImageUrl(path: string | null | undefined): string | null {
    if (!path?.trim()) return null;
    const base = getPublicApiBaseUrl();
    const trimmed = path.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    const relative = trimmed.replace(/^\//, "");
    if (relative.startsWith("storage/")) {
      return `${base}/${relative}`;
    }
    return `${base}/storage/${relative}`;
}