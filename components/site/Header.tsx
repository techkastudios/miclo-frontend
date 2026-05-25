import { fetchHeaderNavLinks } from "@/lib/header-navigation";

import { HeaderClient } from "./HeaderClient";

export async function Header() {
  const links = await fetchHeaderNavLinks();
  return <HeaderClient links={links} />;
}
