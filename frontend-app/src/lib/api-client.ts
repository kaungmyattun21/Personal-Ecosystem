import { NEXT_PUBLIC_API_URL } from "./env";

// Set by <AuthTokenSync /> on every session change — no network calls needed.
let _token: string | null = null;
const _tokenListeners = new Set<() => void>();

export function setAuthToken(token: string | null) {
  if (token === _token) return;
  _token = token;
  _tokenListeners.forEach((fn) => fn());
}

export function getAuthToken(): string | null {
  return _token;
}

/** Subscribe to token changes. Returns an unsubscribe fn (useSyncExternalStore shape). */
export function subscribeAuthToken(listener: () => void): () => void {
  _tokenListeners.add(listener);
  return () => _tokenListeners.delete(listener);
}

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  params?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
};

export async function apiFetch<T = unknown>(
  path: string,
  { params, body, headers, ...rest }: ApiFetchOptions = {},
): Promise<T> {
  let url = `${NEXT_PUBLIC_API_URL}${path}`;
  if (params) {
    const search = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v != null) search.set(k, String(v));
    }
    const qs = search.toString();
    if (qs) url += `?${qs}`;
  }

  const res = await fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(_token ? { Authorization: `Bearer ${_token}` } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status} ${text}`);
  }

  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
