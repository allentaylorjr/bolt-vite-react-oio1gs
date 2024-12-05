import { getToken } from './auth';

interface ApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

export async function apiRequest(endpoint: string, options: ApiOptions = {}) {
  const token = getToken();
  
  const headers: Record<string, string> = {
    ...(options.body && !(options.body instanceof FormData) && {
      'Content-Type': 'application/json',
    }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`/api${endpoint}`, {
    method: options.method || 'GET',
    headers,
    body: options.body instanceof FormData 
      ? options.body 
      : options.body 
      ? JSON.stringify(options.body)
      : undefined,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}