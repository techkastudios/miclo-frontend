export interface Price {
    amount: number;
    formatted: string;
    currency: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string | null;
    status: "active" | "inactive";
    is_featured: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface ProductResponse {
    id: string;
    name: string;
    slug: string;
    sku: string;
    short_description: string;
    status: "published" | "draft" | "archived";
    is_featured: boolean;
    price: Price;
    sale_price: Price | null;
    discount_percentage: number | null;
    featured_image: string;
    gallery: string[] | null;
    category: Category;
    seo: string | null;
    published_at: string;
    created_at: string;
    updated_at: string;
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

export interface LinksMeta {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
}

export interface ProductsApiResponse {
    success: boolean;
    message: string;
    data: ProductResponse[];
    meta: {
        pagination: PaginationMeta;
        links: LinksMeta;
    } | null;
    errors: string | null;
}

export interface BannerCTA {
    label: string | null;
    url: string | null;
    target: string;
    link_type: string;
}

export interface BannerData {
    id: string;
    title: string;
    subtitle: string | null;
    description: string | null;
    image: string;
    mobile_image: string | null;
    cta: BannerCTA;
    position: string;
    sort_order: number;
    starts_at: string | null;
    ends_at: string | null;
}

export interface Banner {
    success: boolean;
    message: string;
    data: BannerData;
    meta: string | null;
    errors: string | null;
}

export interface NavigationItem {
    id: string;
    label: string;
    url: string;
    target: string;
    icon: string | null;
    link_type: string;
    sort_order: number;
    is_active: boolean;
    children: NavigationItem[] | [];
}

export interface NavigationData {
    id: string;
    name: string;
    slug: string;
    type: "header" | "footer" | "sidebar" | string;
    is_active: boolean;
    items: NavigationItem[];
}

export interface NavigationApiResponse {
    success: boolean;
    message: string;
    data: NavigationData;
    meta: string | null;
    errors: string | null;
}
