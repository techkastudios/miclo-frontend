import { OutletGoogleMapsButton } from "./outlet-google-maps-button";
import type { Outlet } from "./outlets-types";

type OutletStoreCardProps = {
  outlet: Outlet;
};

export function OutletStoreCard({ outlet }: OutletStoreCardProps) {
  const {phone, email} = outlet?.contact;
  return (
    <div className="transition-all duration-300 space-y-3 md:space-y-4 xl:space-y-5">
      <h3 className="text-base sm:text-lg font-semibold text-foreground">{outlet.title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {outlet.address.full_address}
      </p>

      {outlet.contact && (
        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
          {phone ? (
            <p>
              <span className="font-medium text-foreground">Phone:</span>{" "}
              <a
                href={`tel:${String(phone).replace(/\s/g, "")}`}
                className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {phone}
              </a>
            </p>
          ) : null}
          {email ? (
            <p>
              <span className="font-medium text-foreground">Email:</span>{" "}
              <a
                href={`mailto:${email}`}
                className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {email}
              </a>
            </p>
          ) : null}
        </div>
      )}

      <p
        className={`text-sm font-medium ${
          outlet.hours.is_open_now ? "text-green-600" : "text-red-500"
        }`}
      >
        {outlet.hours.is_open_now ? "Open Now" : "Closed"} • {outlet.hours.opening_time} -{" "}
        {outlet.hours.closing_time}
      </p>

      <OutletGoogleMapsButton
        fullAddress={outlet.address.full_address}
        googleMapsUrl={outlet.location?.google_maps_url}
      />
    </div>
  );
}
