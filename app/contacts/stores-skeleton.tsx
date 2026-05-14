type StoresSkeletonProps = {
  /** Number of placeholder cards (default matches max desktop column count). */
  cardCount?: number;
};

export function StoresSkeleton({ cardCount = 4 }: StoresSkeletonProps) {
  return (
    <div className="mt-20" aria-busy="true" aria-live="polite">
      <div className="mb-8 h-9 w-48 max-w-full animate-pulse rounded-lg bg-gray-200" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: cardCount }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-4 h-5 w-3/4 rounded bg-gray-200" />
            <div className="mb-2 h-4 w-full rounded bg-gray-100" />
            <div className="mb-2 h-4 w-5/6 rounded bg-gray-100" />
            <div className="mb-4 h-4 w-2/3 rounded bg-gray-100" />
            <div className="mb-4 h-4 w-1/2 rounded bg-gray-100" />
            <div className="mb-6 h-4 w-2/3 rounded bg-gray-200" />
            <div className="h-9 w-full rounded-lg bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
