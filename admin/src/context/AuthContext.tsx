"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, getAuthToken, removeAuthToken, setAuthToken, setCurrentUser, API_URL } from "@/lib/api";

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

  useEffect(() => {
    // Check if user is already logged in
    const storedToken = getAuthToken();
    const storedUser = getCurrentUser();
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (usernameOrEmail: string, password: string) => {
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
      } else {
        throw new Error(data.error || data.message || 'Giriş başarısız');
      }
    } catch (error: any) {
      throw error;
    }
  };

  const logout = () => {
    removeAuthToken();
    setToken(null);
    setUser(null);
    window.location.href = '/signin';
  };

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
