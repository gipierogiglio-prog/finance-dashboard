/**
 * API client for the Financeiro Backend.
 * Calls https://financeiro-api.devgiglio.uk/api/* endpoints.
 * Includes JWT authentication support.
 */

// Backend API base URL
// Uses production URL if on financeiro domain, fallback for local dev
const API_BASE = window.location.hostname.includes('financeiro')
  ? 'https://financeiro-api.devgiglio.uk/api'
  : 'http://localhost:8000/api';

const TOKEN_KEY = 'financeiro_token';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

type Params = Record<string, string | number | undefined>;

/** Get the stored auth token */
function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/** Clear auth token (e.g. on 401 or logout) */
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/** Check if user has a stored token */
export function hasToken(): boolean {
  return !!localStorage.getItem(TOKEN_KEY);
}

/** Save auth token */
export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

async function fetchApi<T>(endpoint: string, params?: Params, options?: RequestInit): Promise<T> {
  const url = new URL(`${API_BASE}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined) url.searchParams.set(key, String(val));
    });
  }

  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  // Attach Bearer token if available (except for /status which is public)
  if (token && !endpoint.startsWith('/status')) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url.toString(), {
    headers: { ...headers, ...(options?.headers as Record<string, string> | undefined) },
    ...options,
  });

  // If 401 Unauthorized — token expired or invalid; clear and redirect to login
  if (res.status === 401) {
    clearToken();
    // Dispatch a custom event so App.tsx can react and show login
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    throw new ApiError(res.status, 'Sessão expirada. Faça login novamente.');
  }

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
  put: <T>(endpoint: string, body?: unknown) =>
    fetchApi<T>(endpoint, undefined, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),
};

/** Login: post credentials and receive JWT token */
export async function login(username: string, password: string): Promise<string> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || 'Credenciais inválidas');
  }

  const data = await res.json();
  saveToken(data.access_token);
  return data.access_token;
}

/** Register a new user */
export async function register(username: string, password: string, displayName?: string): Promise<void> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, display_name: displayName }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || 'Erro ao criar conta');
  }
}

/** Get the current user's Pluggy config */
export async function getPluggyConfig(): Promise<{ configured: boolean; hasItem: boolean }> {
  return api.get('/user/pluggy-config');
}

/** Save Pluggy credentials */
export async function savePluggyConfig(clientId: string, clientSecret: string): Promise<void> {
  await api.put('/user/pluggy-config', { client_id: clientId, client_secret: clientSecret });
}

/** Get current user profile */
export async function getUserProfile(): Promise<{ id: number; username: string; display_name?: string }> {
  return api.get('/user/me');
}

/** Check API connection (public endpoint, no auth required) */
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