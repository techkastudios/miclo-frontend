export type BannerCta = {
    label: string | null;
    url: string | null;
    target?: string;
};
  
export type Banner = {
    id: string;
    title: string | null;
    subtitle: string | null;
    image: string | null;
    mobile_image?: string | null;
    position: string;
    sort_order: number;
    cta: BannerCta;
};