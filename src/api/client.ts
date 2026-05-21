/**
 * API client for the Financeiro Backend.
 * Calls https://financeiro-api.devgiglio.uk/api/* endpoints.
 */

// Backend API base URL
// Uses production URL if on financeiro domain, fallback for local dev
const API_BASE = window.location.hostname.includes('financeiro')
  ? 'https://financeiro-api.devgiglio.uk/api'
  : 'http://localhost:8000/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

type Params = Record<string, string | number | undefined>;

async function fetchApi<T>(endpoint: string, params?: Params, options?: RequestInit): Promise<T> {
  const url = new URL(`${API_BASE}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined) url.searchParams.set(key, String(val));
    });
  }
  
  const res = await fetch(url.toString(), {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    throw new ApiError(res.status, `API error: ${res.statusText}`);
  }

  return res.json();
}

export const api = {
  get: <T>(endpoint: string, params?: Params) => fetchApi<T>(endpoint, params),
  post: <T>(endpoint: string, body?: unknown) =>
    fetchApi<T>(endpoint, undefined, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
};

export async function checkApiConnection(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${API_BASE}/status`, { signal: controller.signal });
    clearTimeout(timeout);
    return res.ok;
  } catch {
    return false;
  }
}
