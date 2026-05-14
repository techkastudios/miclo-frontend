import { apiFetchJson } from "@/lib/api";

import { OutletStoreCard } from "./outlet-store-card";
import {
  type OutletsApiResponse,
  isOutletsApiResponse,
  outletsFetchFailureMessage,
} from "./outlets-types";

export async function StoresSection() {
  const result = await apiFetchJson<OutletsApiResponse>("/api/v1/outlets", {
    validate: isOutletsApiResponse,
  });

  if (!result.ok) {
    return (
      <section className="mt-10 md:mt-16">
        <h2 className="mb-8 text-3xl font-semibold text-foreground">Our Stores</h2>
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          role="alert"
        >
          {outletsFetchFailureMessage(result)}
        </div>
      </section>
    );
  }

  const outlets = result.data.data;

  if (outlets.length === 0) {
    return (
      <section className="mt-10 md:mt-16">
        <h2 className="mb-8 text-3xl font-semibold text-foreground">Our Stores</h2>
        <p className="text-sm text-muted-foreground">No store locations are available right now.</p>
      </section>
    );
  }

  return (
    <section className="mt-10 md:mt-16">
      <h2 className="mb-8 text-3xl font-semibold text-foreground">Our Stores</h2>

      <div className="grid grid-cols-1 gap-6 md:gap-y-10 xl:gap-y-16 sm:grid-cols-2 xl:grid-cols-4">
        {outlets.map((outlet) => (
          <OutletStoreCard
            key={
              outlet.id != null ? String(outlet.id) : `${outlet.title}-${outlet.address.full_address}`
            }
            outlet={outlet}
          />
        ))}
      </div>
    </section>
  );
}
