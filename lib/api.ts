import { Banner, Cat, NavigationApiResponse, PageApiResponse, ProductsApiResponse, SingleProductApiResponse } from "@/types";
import { resolvePublicImageUrl } from "@/lib/utils";

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
    | "about_hero"
    | "home_secondary"
    | "category_hero"
    | "product_page"
    | "promotional";

function isBannersResponse(data: unknown): data is Banner {
    if (!data || typeof data !== "object") return false;
    const o = data as Record<string, unknown>;
    return o.success === true;
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
        success: true,
        message: "success",
        data: {
            id: "1",
            title: "",
            subtitle: "",
            description: "",
            image: fallback_src,
            mobile_image: "",
            cta: {
                label: "",
                url: "",
                target: "_self",
                link_type: "custom",
            },
            position: "",
            sort_order: 1,
            starts_at: "",
            ends_at: "",
        },
        meta: "",
        errors: "",
    };

    try {
        const result = await apiFetchJson<Banner>(`/api/v1/banners?position=${position}`, {
            next: { revalidate: 60 },
            validate: isBannersResponse,
        });

        if (!result.ok) return fallback;

        const resolved = resolvePublicImageUrl(
            result.data?.data?.image ?? result.data.data?.mobile_image ?? null,
        );

        if (!resolved) return fallback;

        return {
            success: true,
            message: "success",
            data: {
                ...result.data.data,
                image: resolved,
            },
            meta: "",
            errors: "",
        };
    } catch {
        return fallback;
    }
}

function isProductsApiResponse(data: unknown): data is ProductsApiResponse {
    if (!data || typeof data !== "object") return false;
    const o = data as Record<string, unknown>;
    return o.success === true && Array.isArray(o.data);
}

export type GetProductsOptions = ApiFetchOptions & {
    type?: string;
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
    const { type, category, page, perPage, next, ...fetchOptions } = options ?? {};
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (page) params.set("page", String(page));
    if (perPage) params.set("per_page", String(perPage));
    const qs = params.toString();
    const path = type
        ? `/api/v1/products/${type}`
        : qs
          ? `/api/v1/products?${qs}`
          : "/api/v1/products";

    return apiFetchJson<ProductsApiResponse>(path, {
        ...fetchOptions,
        next: { revalidate: 60, ...next },
        validate: isProductsApiResponse,
    });
}

function isSingleProductApiResponse(data: unknown): data is SingleProductApiResponse {
    if (!data || typeof data !== "object") return false;
    const o = data as Record<string, unknown>;
    return o.success === true && o.data !== null && typeof o.data === "object" && !Array.isArray(o.data);
}

/**
 * Fetches a single product by slug from `GET /api/v1/products/{slug}`.
 * Returns the parsed API response with `data` as a single `ProductResponse`.
 */
export async function getProduct(
    slug: string,
    options?: ApiFetchOptions,
): Promise<ApiJsonSuccess<SingleProductApiResponse> | ApiJsonFailure> {
    const { next, ...fetchOptions } = options ?? {};

    return apiFetchJson<SingleProductApiResponse>(`/api/v1/products/${slug}`, {
        ...fetchOptions,
        next: { revalidate: 60, ...next },
        validate: isSingleProductApiResponse,
    });
}

function isNavigationApiResponse(data: unknown): data is NavigationApiResponse {
    if (!data || typeof data !== "object") return false;
    const o = data as Record<string, unknown>;
    return o.success === true && o.data !== null && typeof o.data === "object";
}

/**
 * Fetches a navigation menu by slug from `GET /api/v1/navigations/{slug}`.
 * Returns the parsed API response on success, or a structured failure on error.
 */
export async function getNavigation(
    slug: string,
    options?: ApiFetchOptions,
): Promise<ApiJsonSuccess<NavigationApiResponse> | ApiJsonFailure> {
    const { next, ...fetchOptions } = options ?? {};

    return apiFetchJson<NavigationApiResponse>(`/api/v1/navigations/${slug}`, {
        ...fetchOptions,
        next: { revalidate: 60, ...next },
        validate: isNavigationApiResponse,
    });
}

function isPageApiResponse(data: unknown): data is PageApiResponse {
    if (!data || typeof data !== "object") return false;
    const o = data as Record<string, unknown>;
    return o.success === true && o.data !== null && typeof o.data === "object";
}

/**
 * Fetches a CMS page by slug from `GET /api/v1/pages/{slug}`.
 * Returns the parsed API response on success, or a structured failure on error.
 */
export async function getPage(
    slug: string,
    options?: ApiFetchOptions,
): Promise<ApiJsonSuccess<PageApiResponse> | ApiJsonFailure> {
    const { next, ...fetchOptions } = options ?? {};

    return apiFetchJson<PageApiResponse>(`/api/v1/pages/${slug}`, {
        ...fetchOptions,
        next: { revalidate: 60, ...next },
        validate: isPageApiResponse,
    });
}


const FALLBACK_CATS: Cat[] = [
    { title: "Womenswear", img: "/assets/cat-women.jpg", href: "#" },
    { title: "Menswear", img: "/assets/cat-men.jpg", href: "#" },
    { title: "Kidswear", img: "/assets/cat-kids.jpg", href: "#" },
    { title: "Accessories", img: "/assets/cat-accessories.jpg", href: "#" },
    { title: "Winter Collection", img: "/assets/cat-winter.jpg", href: "#" },
  ];
  
  type FeaturedCategory = {
    id: string;
    name: string;
    slug: string;
    image: string;
    sort_order: number;
  };
  
  type FeaturedCategoriesResponse = {
    success: boolean;
    data: FeaturedCategory[];
  };
  
  function isFeaturedCategoriesResponse(
    data: unknown
  ): data is FeaturedCategoriesResponse {
    if (!data || typeof data !== "object") return false;
    const o = data as Record<string, unknown>;
    if (o.success !== true || !Array.isArray(o.data)) return false;
    return o.data.every(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof (item as FeaturedCategory).name === "string" &&
        typeof (item as FeaturedCategory).slug === "string" &&
        typeof (item as FeaturedCategory).image === "string" &&
        typeof (item as FeaturedCategory).sort_order === "number"
    );
  }
  
  function resolveCategoryImageUrl(path: string | null | undefined): string | null {
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
  
  function mapApiCategory(c: FeaturedCategory): Cat | null {
    const img = resolveCategoryImageUrl(c.image);
    if (!img) return null;
    return {
      title: c.name,
      img,
      href: `${c.slug}`,
    };
  }
  
  export async function getFeaturedCategories(): Promise<Cat[]> {
    try {
      const result = await apiFetchJson<FeaturedCategoriesResponse>(
        "/api/v1/categories/featured",
        {
          next: { revalidate: 60 },
          // validate: isFeaturedCategoriesResponse,
        }
      );
    
      if (!result.ok) return FALLBACK_CATS;
  
      const sorted = [...result.data.data].sort(
        (a, b) => a.sort_order - b.sort_order
      );
      const mapped = sorted
        .map(mapApiCategory)
        .filter((c): c is Cat => c !== null);
  
      return mapped.length > 0 ? mapped : FALLBACK_CATS;
    } catch {
      return FALLBACK_CATS;
    }
  }
