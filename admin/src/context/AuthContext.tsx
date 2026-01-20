"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { getCurrentUser, getAuthToken, removeAuthToken, setAuthToken, setCurrentUser, API_URL } from "@/lib/api";

// 6 saat = 6 * 60 * 60 * 1000 milisaniye
const AUTO_LOGOUT_INTERVAL = 6 * 60 * 60 * 1000; // 6 saat
const LOGIN_TIME_KEY = 'admin_login_time';

interface User {
  id: number;
  username?: string; // Email kullanılacak
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'admin' | 'manager' | 'editor' | 'viewer';
  is_active: boolean;
  avatar_url?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (requiredRole: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const autoLogoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Otomatik logout işlemi
  const handleAutoLogout = React.useCallback(() => {
    if (typeof window === 'undefined') return;
    
    removeAuthToken();
    localStorage.removeItem(LOGIN_TIME_KEY);
    setToken(null);
    setUser(null);
    
    // Sadece admin panel sayfalarındaysa signin'e yönlendir
    if (window.location.pathname && !window.location.pathname.includes('/signin')) {
      window.location.href = '/signin';
    }
  }, []);

  // Otomatik logout zamanlayıcısı
  const scheduleAutoLogout = React.useCallback((delay: number) => {
    // Önceki timer'ı temizle
    if (autoLogoutTimerRef.current) {
      clearTimeout(autoLogoutTimerRef.current);
    }

    // Yeni timer kur
    autoLogoutTimerRef.current = setTimeout(() => {
      handleAutoLogout();
    }, delay);
  }, [handleAutoLogout]);

  // Otomatik logout kontrolü
  const checkAutoLogout = React.useCallback(() => {
    if (typeof window === 'undefined') return;

    const loginTimeStr = localStorage.getItem(LOGIN_TIME_KEY);
    if (!loginTimeStr) return;

    const loginTime = parseInt(loginTimeStr, 10);
    const now = Date.now();
    const timeElapsed = now - loginTime;

    // 6 saat geçtiyse logout yap
    if (timeElapsed >= AUTO_LOGOUT_INTERVAL) {
      handleAutoLogout();
    } else {
      // Kalan süreyi hesapla ve timer kur
      const remainingTime = AUTO_LOGOUT_INTERVAL - timeElapsed;
      scheduleAutoLogout(remainingTime);
    }
  }, [handleAutoLogout, scheduleAutoLogout]);

  useEffect(() => {
    // Check if user is already logged in
    const storedToken = getAuthToken();
    const storedUser = getCurrentUser();
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
      
      // Login zamanını kontrol et ve otomatik logout zamanla
      checkAutoLogout();
    } else {
      // Eğer giriş yapılmamışsa login zamanını temizle
      if (typeof window !== 'undefined') {
        localStorage.removeItem(LOGIN_TIME_KEY);
      }
    }
    
    setIsLoading(false);

    // Cleanup function
    return () => {
      if (autoLogoutTimerRef.current) {
        clearTimeout(autoLogoutTimerRef.current);
      }
    };
  }, [checkAutoLogout]);

  const login = React.useCallback(async (usernameOrEmail: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Giriş başarısız');
      }
      
      if (data.success && data.token && data.user) {
        // Email'i username olarak kullan
        const userData = {
          ...data.user,
          username: data.user.email
        };
        setAuthToken(data.token);
        setCurrentUser(userData);
        setToken(data.token);
        setUser(userData);
        
        // Login zamanını kaydet
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOGIN_TIME_KEY, Date.now().toString());
        }
        
        // 6 saat sonra otomatik logout zamanla
        scheduleAutoLogout(AUTO_LOGOUT_INTERVAL);
      } else {
        throw new Error(data.error || data.message || 'Giriş başarısız');
      }
    } catch (error: any) {
      throw error;
    }
  }, [scheduleAutoLogout]);

  const logout = React.useCallback(() => {
    // Timer'ı temizle
    if (autoLogoutTimerRef.current) {
      clearTimeout(autoLogoutTimerRef.current);
    }
    
    removeAuthToken();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOGIN_TIME_KEY);
    }
    setToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/signin';
    }
  }, []);

  const hasPermission = (requiredRoles: string[]): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true; // Admin her şeyi yapabilir
    
    return requiredRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
