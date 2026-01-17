/**
 * API Configuration
 * Backend API URL'ini environment variable'dan alır
 */
const getApiUrl = () => {
  // Client-side'da NEXT_PUBLIC_BACKEND_URL kullanılır
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'https://api.dekoartizan.com';
  }
  // Server-side'da BACKEND_URL veya API_URL kullanılır (NEXT_PUBLIC prefix'i olmadan)
  return process.env.BACKEND_URL || process.env.API_URL || 'https://api.dekoartizan.com';
};

export const API_URL = getApiUrl();

/**
 * Base URL for the frontend application
 */
export const BASE_URL = typeof window !== 'undefined' 
  ? process.env.NEXT_PUBLIC_BASE_URL || 'https://dekoartizan.com'
  : process.env.SITE_URL || 'https://dekoartizan.com';

/**
 * API helper function for making requests
 */
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  return fetch(url, defaultOptions);
};

/**
 * API helper for GET requests
 */
export const apiGet = async <T = any>(endpoint: string): Promise<T> => {
  const response = await apiRequest(endpoint, { method: 'GET' });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * API helper for POST requests
 */
export const apiPost = async <T = any>(
  endpoint: string,
  data: any
): Promise<T> => {
  const response = await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * API helper for PUT requests
 */
export const apiPut = async <T = any>(
  endpoint: string,
  data: any
): Promise<T> => {
  const response = await apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * API helper for DELETE requests
 */
export const apiDelete = async <T = any>(endpoint: string): Promise<T> => {
  const response = await apiRequest(endpoint, { method: 'DELETE' });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};
