const DEFAULT_PUBLIC_API_URL = "http://localhost:8080";

/** Backend origin without a trailing slash (aligned with `next.config` image remote defaults). */
export function getPublicApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_PUBLIC_API_URL;
  return raw.replace(/\/$/, "");
}

/** Absolute URL for a path on the configured API origin (path should start with `/`). */
export function resolveApiUrl(path: string): string {
  const base = getPublicApiBaseUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

export type ApiNextFetchConfig = {
  revalidate?: number | false;
  tags?: string[];
};

export type ApiFetchOptions = RequestInit & {
  next?: ApiNextFetchConfig;
};

export type ApiJsonOptions<T = unknown> = ApiFetchOptions & {
  /** When set, unsuccessful validation yields `validation` failure instead of typed success. */
  validate?: (data: unknown) => data is T;
};

export type ApiFetchSuccess = { ok: true; response: Response };

export type ApiFetchFailure =
  | { ok: false; kind: "http"; status: number; response: Response }
  | { ok: false; kind: "network"; cause: unknown };

export type ApiJsonSuccess<T> = { ok: true; data: T; response: Response };

export type ApiJsonFailure =
  | ApiFetchFailure
  | { ok: false; kind: "parse"; cause: unknown }
  | { ok: false; kind: "validation"; data: unknown };

function mergeHeaders(init: RequestInit | undefined): Headers {
  const headers = new Headers(init?.headers ?? undefined);
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }
  return headers;
}

/**
 * Low-level fetch to the API origin: use for non-JSON bodies or custom parsing.
 */
export async function apiFetch(
  path: string,
  options?: ApiFetchOptions
): Promise<ApiFetchSuccess | ApiFetchFailure> {
  const { next, ...requestInit } = options ?? {};
  const url = resolveApiUrl(path);

  let response: Response;
  try {
    response = await fetch(url, {
      ...requestInit,
      headers: mergeHeaders(requestInit),
      ...(next !== undefined ? { next } : {}),
    });
  } catch (cause) {
    return { ok: false, kind: "network", cause };
  }

  if (!response.ok) {
    return { ok: false, kind: "http", status: response.status, response };
  }

  return { ok: true, response };
}

/**
 * JSON fetch with optional schema guard. Centralizes base URL, errors, and Next cache options.
 */
export async function apiFetchJson<T = unknown>(
  path: string,
  options?: ApiJsonOptions<T>
): Promise<ApiJsonSuccess<T> | ApiJsonFailure> {
  const { validate, ...rest } = options ?? {};
  const result = await apiFetch(path, rest);

  if (!result.ok) {
    return result;
  }

  let parsed: unknown;
  try {
    parsed = await result.response.json();
  } catch (cause) {
    return { ok: false, kind: "parse", cause };
  }

  if (validate && !validate(parsed)) {
    return { ok: false, kind: "validation", data: parsed };
  }

  return { ok: true, data: parsed as T, response: result.response };
}
