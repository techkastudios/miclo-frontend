import type { ApiJsonFailure } from "@/lib/api";

export interface OutletHours {
  is_open_now: boolean;
  opening_time: string;
  closing_time: string;
}

export interface OutletAddress {
  full_address: string;
}

export interface OutletLocation {
  google_maps_url?: string | null;
}

export interface Contact {
  phone: string;
  whatsapp?: string;
  whatsapp_url?: string;
  email?: string;
}

export interface Outlet {
  id?: string | number;
  title: string;
  address: OutletAddress;
  contact: Contact;
  hours: OutletHours;
  location?: OutletLocation;
}

export interface OutletsApiResponse {
  data: Outlet[];
}

export function isOutletsApiResponse(data: unknown): data is OutletsApiResponse {
  if (data === null || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;
  return Array.isArray(obj.data);
}

export function outletsFetchFailureMessage(failure: ApiJsonFailure): string {
  if (failure.kind === "network") {
    return "Could not reach the server. Check your connection and try again.";
  }
  if (failure.kind === "http") {
    return `Stores could not be loaded (${failure.status}).`;
  }
  if (failure.kind === "parse") {
    return "Received an invalid response from the server.";
  }
  return "Stores data did not match the expected format.";
}
