"use client";

import { useCallback } from "react";

type OutletGoogleMapsButtonProps = {
  fullAddress: string;
  googleMapsUrl?: string | null;
};

function resolveMapsUrl(fullAddress: string, googleMapsUrl?: string | null): string {
  return (
    googleMapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
  );
}

export function OutletGoogleMapsButton({ fullAddress, googleMapsUrl }: OutletGoogleMapsButtonProps) {
  const openMaps = useCallback(() => {
    const mapUrl = resolveMapsUrl(fullAddress, googleMapsUrl);
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = mapUrl;
    } else {
      window.open(mapUrl, "_blank", "noopener,noreferrer");
    }
  }, [fullAddress, googleMapsUrl]);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLButtonElement>) => {
      e.preventDefault();
      openMaps();
    },
    [openMaps],
  );

  return (
    <button
      type="button"
      onClick={openMaps}
      onTouchEnd={onTouchEnd}
      className="btn-outline touch-manipulation"
    >
      Google Maps
    </button>
  );
}
