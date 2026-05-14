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

/** Native anchor so Android reliably opens Maps from touch (no JS navigation). */
export function OutletGoogleMapsButton({ fullAddress, googleMapsUrl }: OutletGoogleMapsButtonProps) {
  const mapUrl = resolveMapsUrl(fullAddress, googleMapsUrl);

  return (
    <a
      href={mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-outline touch-manipulation"
    >
      Google Maps
    </a>
  );
}
