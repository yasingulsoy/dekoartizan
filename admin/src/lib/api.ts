const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  }
  return process.env.BACKEND_URL || process.env.API_URL || 'http://localhost:5000';
};

export const API_URL = getApiUrl();

const readErrorMessage = async (response: Response): Promise<string> => {
  const contentType = response.headers.get('content-type') || '';

  // JSON ise mesajı yakala
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

  // Değilse text olarak dene (proxy/NGINX/Next 404 gibi durumlarda çok işe yarar)
  try {
    const text = await response.text();
    return text ? text.slice(0, 500) : `${response.status} ${response.statusText}`;
  } catch {
    return `${response.status} ${response.statusText}`;
  }
};

/**
 * Get auth token from localStorage
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
};

/**
 * Set auth token to localStorage
 */
export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('admin_token', token);
};

/**
 * Remove auth token from localStorage
 */
export const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = (): any | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('admin_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Set current user to localStorage
 */
export const setCurrentUser = (user: any): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('admin_user', JSON.stringify(user));
};

/**
 * API request helper with authentication
 */
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const token = getAuthToken();
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  };

  return fetch(url, defaultOptions);
};

/**
 * API GET request
 */
export const apiGet = async <T = any>(endpoint: string): Promise<T> => {
  const response = await apiRequest(endpoint, { method: 'GET' });
  
  if (!response.ok) {
    if (response.status === 401) {
      removeAuthToken();
      window.location.href = '/signin';
      throw new Error('Unauthorized');
    }
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
 * API POST request
 */
export const apiPost = async <T = any>(endpoint: string, data?: any): Promise<T> => {
  const response = await apiRequest(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      removeAuthToken();
      window.location.href = '/signin';
      throw new Error('Unauthorized');
    }
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
 * API PUT request
 */
export const apiPut = async <T = any>(endpoint: string, data?: any): Promise<T> => {
  const response = await apiRequest(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      removeAuthToken();
      window.location.href = '/signin';
      throw new Error('Unauthorized');
    }
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
 * API PATCH request
 */
export const apiPatch = async <T = any>(endpoint: string, data?: any): Promise<T> => {
  const response = await apiRequest(endpoint, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      removeAuthToken();
      window.location.href = '/signin';
      throw new Error('Unauthorized');
    }
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
 * API DELETE request
 */
export const apiDelete = async <T = any>(endpoint: string, data?: any): Promise<T> => {
  const response = await apiRequest(endpoint, {
    method: 'DELETE',
    body: data ? JSON.stringify(data) : undefined,
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      removeAuthToken();
      window.location.href = '/signin';
      throw new Error('Unauthorized');
    }
    const message = await readErrorMessage(response);
    throw new Error(
      `[${response.status}] ${endpoint} - ${message}${
        response.status === 404 ? ` (API_URL: ${API_URL})` : ''
      }`
    );
  }
  
  return response.json();
};
