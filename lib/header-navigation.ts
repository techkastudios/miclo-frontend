import { apiFetchJson } from "@/lib/api";

export type HeaderNavLink = {
  id: string;
  label: string;
  url: string;
  target: string;
};

type ApiNavItem = {
  id: string;
  label: string;
  url: string;
  target: string;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  children: ApiNavItem[];
};

type ApiNavigationGroup = {
  id: string;
  name: string;
  slug: string;
  type: string;
  is_active: boolean;
  items: ApiNavItem[];
};

type NavigationsApiBody = {
  success: boolean;
  data: ApiNavigationGroup[];
};

function isNavigationsBody(data: unknown): data is NavigationsApiBody {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return d.success === true && Array.isArray(d.data);
}

function isNavItem(value: unknown): value is ApiNavItem {
  if (!value || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.label === "string" &&
    typeof o.url === "string" &&
    typeof o.target === "string" &&
    typeof o.sort_order === "number" &&
    o.is_active === true &&
    Array.isArray(o.children)
  );
}

function pickHeaderGroup(groups: ApiNavigationGroup[]): ApiNavigationGroup | undefined {
  return groups.find(
    (nav) => nav.is_active === true && (nav.type === "header" || nav.slug === "header")
  );
}

/**
 * Loads header navigation links from the CMS/API (server-side).
 */
export async function fetchHeaderNavLinks(): Promise<HeaderNavLink[]> {
  const result = await apiFetchJson("/api/v1/navigations", {
    validate: isNavigationsBody,
    next: { revalidate: 300 },
  });

  if (!result.ok) {
    return [];
  }

  const group = pickHeaderGroup(result.data.data);
  if (!group?.items?.length) {
    return [];
  }

  const items = group.items.filter(isNavItem);
  items.sort((a, b) => a.sort_order - b.sort_order);

  return items.map((item) => ({
    id: item.id,
    label: item.label,
    url: item.url,
    target: item.target,
  }));
}
