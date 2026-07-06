const API_URL = (import.meta.env as { VITE_API_URL?: string }).VITE_API_URL ?? '/api';

export interface ApiError {
  detail?: string;
}

export interface ApiResponse<T = unknown> {
  ok: boolean;
  data: T | ApiError;
  status: number;
}

export async function apiRequest<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    // Attach Authorization header if token present in localStorage
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const existingHeaders = (options.headers as Record<string, string> | undefined) || {};
        options.headers = { ...existingHeaders, Authorization: `Bearer ${token}` };
      }
    } catch (e) {
      // localStorage may not be available in some environments (safe fallback)
    }

    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();
    return { ok: response.ok, data, status: response.status };
  } catch (error) {
    console.error(`Erreur sur l'endpoint ${endpoint}:`, error);
    return { ok: false, data: { detail: 'Connexion au serveur impossible' }, status: 0 };
  }
}
