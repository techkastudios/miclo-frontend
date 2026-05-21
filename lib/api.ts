import { Banner } from "@/types";
import { resolvePublicImageUrl } from "@/lib/utils";
import type { ProductsApiResponse } from "@/types/apiResponseTypes";

const DEFAULT_PUBLIC_API_URL = "http://localhost:8080";

/** Backend origin without a trailing slash (aligned with `next.config` image remote defaults). */
export function getPublicApiBaseUrl(): string {
    const raw = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_PUBLIC_API_URL;
    return raw.replace(/\/$/, "");
}

/** Absolute URL for a path on the configured API origin (path should start with `/`). */
export function resolveApiUrl(path: string): string {
    const base = getPublicApiBaseUrl();
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `${base}${normalized}`;
}

export type ApiNextFetchConfig = {
    revalidate?: number | false;
    tags?: string[];
};

export type ApiFetchOptions = RequestInit & {
    next?: ApiNextFetchConfig;
};

export type ApiJsonOptions<T = unknown> = ApiFetchOptions & {
    /** When set, unsuccessful validation yields `validation` failure instead of typed success. */
    validate?: (data: unknown) => data is T;
};

export type ApiFetchSuccess = { ok: true; response: Response };

export type ApiFetchFailure =
    | { ok: false; kind: "http"; status: number; response: Response }
    | { ok: false; kind: "network"; cause: unknown };

export type ApiJsonSuccess<T> = { ok: true; data: T; response: Response };

export type ApiJsonFailure =
    | ApiFetchFailure
    | { ok: false; kind: "parse"; cause: unknown }
    | { ok: false; kind: "validation"; data: unknown };

function mergeHeaders(init: RequestInit | undefined): Headers {
    const headers = new Headers(init?.headers ?? undefined);
    if (!headers.has("Accept")) {
        headers.set("Accept", "application/json");
    }
    return headers;
}

/**
 * Low-level fetch to the API origin: use for non-JSON bodies or custom parsing.
 */
export async function apiFetch(
    path: string,
    options?: ApiFetchOptions,
): Promise<ApiFetchSuccess | ApiFetchFailure> {
    const { next, ...requestInit } = options ?? {};
    const url = resolveApiUrl(path);

    let response: Response;
    try {
        response = await fetch(url, {
            ...requestInit,
            headers: mergeHeaders(requestInit),
            ...(next !== undefined ? { next } : {}),
        });
    } catch (cause) {
        return { ok: false, kind: "network", cause };
    }

    if (!response.ok) {
        return { ok: false, kind: "http", status: response.status, response };
    }

    return { ok: true, response };
}

/**
 * JSON fetch with optional schema guard. Centralizes base URL, errors, and Next cache options.
 */
export async function apiFetchJson<T = unknown>(
    path: string,
    options?: ApiJsonOptions<T>,
): Promise<ApiJsonSuccess<T> | ApiJsonFailure> {
    const { validate, ...rest } = options ?? {};
    const result = await apiFetch(path, rest);

    if (!result.ok) {
        return result;
    }

    let parsed: unknown;
    try {
        parsed = await result.response.json();
    } catch (cause) {
        return { ok: false, kind: "parse", cause };
    }

    if (validate && !validate(parsed)) {
        return { ok: false, kind: "validation", data: parsed };
    }

    return { ok: true, data: parsed as T, response: result.response };
}

type BannerPosition =
    | "home_hero"
    | "home_secondary"
    | "category_hero"
    | "product_page"
    | "promotional";

export type BannersResponse = {
    success: boolean;
    data: Banner[];
};

function isBannersResponse(data: unknown): data is BannersResponse {
    if (!data || typeof data !== "object") return false;
    const o = data as Record<string, unknown>;
    return o.success === true && Array.isArray(o.data);
}

/**
 * Loads banners from `GET /api/v1/banners`, picks the entry for `position`, and
 * resolves `image` to a public URL. On HTTP/parse/validation errors, missing
 * banners, or an unresolvable image, returns a static fallback built from
 * `fallback_src`.
 *
 * @param position - Banner slot to prefer; defaults to `home_hero`.
 * @param fallback_src - Image URL used when the API call or resolution fails.
 * @returns Resolved {@link Banner} (API match or `fallback_src` fallback).
 */
export async function getHeroBanner(
    position: BannerPosition = "home_hero",
    fallback_src: string,
): Promise<Banner> {
    const fallback = {
        id: "1",
        title: "The new",
        subtitle: "arrivals",
        image: fallback_src,
        position,
        sort_order: 0,
        cta: {
            label: "New Arrivals",
            url: "/collection/new-arrivals",
        },
    };

    try {
        const result = await apiFetchJson<BannersResponse>("/api/v1/banners", {
            next: { revalidate: 60 },
            validate: isBannersResponse,
        });

        if (!result.ok) return fallback;

        const json = result.data;
        const sorted = [...json.data].sort((a, b) => a.sort_order - b.sort_order);
        const banner = sorted.find((b) => b.position === position) ?? sorted[0] ?? null;

        const resolved = resolvePublicImageUrl(banner?.image ?? banner?.mobile_image ?? null);

        if (!resolved) return fallback;

        return {
            ...banner,
            image: resolved,
        };
    } catch {
        return fallback;
    }
}

function isProductsApiResponse(data: unknown): data is ProductsApiResponse {
    if (!data || typeof data !== "object") return false;
    const o = data as Record<string, unknown>;
    return (
        o.success === true &&
        Array.isArray(o.data) &&
        o.meta !== null &&
        typeof o.meta === "object"
    );
}

export type GetProductsOptions = ApiFetchOptions & {
    category?: string;
    page?: number;
    perPage?: number;
};

/**
 * Fetches products from `GET /api/v1/products` with optional category, page, and per-page filters.
 * Returns the parsed API response on success, or a structured failure on error.
 */
export async function getProducts(
    options?: GetProductsOptions,
): Promise<ApiJsonSuccess<ProductsApiResponse> | ApiJsonFailure> {
    const { category, page, perPage, next, ...fetchOptions } = options ?? {};
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (page) params.set("page", String(page));
    if (perPage) params.set("per_page", String(perPage));
    const qs = params.toString();
    const path = qs ? `/api/v1/products?${qs}` : "/api/v1/products";

    return apiFetchJson<ProductsApiResponse>(path, {
        ...fetchOptions,
        next: { revalidate: 60, ...next },
        validate: isProductsApiResponse,
    });
}
