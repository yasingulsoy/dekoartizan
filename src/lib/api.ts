/**
 * API Configuration
 * Backend API URL'ini environment variable'dan alır
 */
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  }
  // Server-side'da localhost yerine 127.0.0.1 kullan (daha güvenilir)
  return process.env.BACKEND_URL || process.env.API_URL || 'http://127.0.0.1:5000';
};

export const API_URL = getApiUrl();

/**
 * Base URL for the frontend application
 */
export const BASE_URL = typeof window !== 'undefined' 
  ? process.env.NEXT_PUBLIC_BASE_URL || 'https://dekoartizan.com'
  : process.env.SITE_URL || 'https://dekoartizan.com';

/**
 * Retry configuration
 */
interface RetryOptions {
  retries?: number;
  retryDelay?: number;
  retryOn?: (response: Response) => boolean;
}

const defaultRetryOptions: RetryOptions = {
  retries: 3,
  retryDelay: 1000,
  retryOn: (response) => {
    // Retry on network errors or 5xx server errors
    return !response.ok && response.status >= 500;
  },
};

/**
 * Sleep function for retry delays
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const readErrorMessage = async (response: Response): Promise<string> => {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    try {
      const data: any = await response.json();
      return (
        data?.message ||
        data?.error ||
        data?.details?.message ||
        JSON.stringify(data)
      );
    } catch {
      // fallthrough
    }
  }

  try {
    const text = await response.text();
    return text ? text.slice(0, 500) : `${response.status} ${response.statusText}`;
  } catch {
    return `${response.status} ${response.statusText}`;
  }
};

/**
 * API helper function for making requests with retry mechanism
 */
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): Promise<Response> => {
  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  // Get token from localStorage if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const retryConfig = { ...defaultRetryOptions, ...retryOptions };
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= (retryConfig.retries || 3); attempt++) {
    try {
      const response = await fetch(url, defaultOptions);
      
      // If response is ok or not retryable, return it
      if (response.ok || !retryConfig.retryOn?.(response)) {
        return response;
      }

      // If this is the last attempt, throw error
      if (attempt === (retryConfig.retries || 3)) {
        return response;
      }

      // Wait before retrying
      await sleep(retryConfig.retryDelay || 1000 * (attempt + 1));
    } catch (error) {
      lastError = error as Error;
      
      // If this is the last attempt, throw error
      if (attempt === (retryConfig.retries || 3)) {
        throw lastError;
      }

      // Wait before retrying
      await sleep(retryConfig.retryDelay || 1000 * (attempt + 1));
    }
  }

  throw lastError || new Error('Request failed after retries');
};

/**
 * API helper for GET requests
 */
export const apiGet = async <T = any>(endpoint: string): Promise<T> => {
  const response = await apiRequest(endpoint, { method: 'GET' });
  
  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(
      `[${response.status}] ${endpoint} - ${message}${
        response.status === 404 ? ` (API_URL: ${API_URL})` : ''
      }`
    );
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
    const message = await readErrorMessage(response);
    throw new Error(
      `[${response.status}] ${endpoint} - ${message}${
        response.status === 404 ? ` (API_URL: ${API_URL})` : ''
      }`
    );
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
    const message = await readErrorMessage(response);
    throw new Error(
      `[${response.status}] ${endpoint} - ${message}${
        response.status === 404 ? ` (API_URL: ${API_URL})` : ''
      }`
    );
  }
  
  return response.json();
};

/**
 * API helper for DELETE requests
 */
export const apiDelete = async <T = any>(endpoint: string): Promise<T> => {
  const response = await apiRequest(endpoint, { method: 'DELETE' });
  
  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(
      `[${response.status}] ${endpoint} - ${message}${
        response.status === 404 ? ` (API_URL: ${API_URL})` : ''
      }`
    );
  }
  
  return response.json();
};
