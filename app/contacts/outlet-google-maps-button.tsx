"use client";

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
  return (
    <button
      type="button"
      onClick={() => {
        const mapUrl = resolveMapsUrl(fullAddress, googleMapsUrl);
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isMobile) {
          window.location.href = mapUrl;
        } else {
          window.open(mapUrl, "_blank", "noopener,noreferrer");
        }
      }}
      className="btn-outline"
    >
      Google Maps
    </button>
  );
}
