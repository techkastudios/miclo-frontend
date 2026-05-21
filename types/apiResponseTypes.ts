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
