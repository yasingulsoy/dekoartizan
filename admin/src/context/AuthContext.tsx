"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, getAuthToken, removeAuthToken, setAuthToken, setCurrentUser } from "@/lib/api";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'manager' | 'editor' | 'viewer';
  is_active: boolean;
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/admin/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Giriş başarısız' }));
        throw new Error(error.message || 'Giriş başarısız');
      }

      const data = await response.json();
      
      if (data.success && data.token && data.user) {
        setAuthToken(data.token);
        setCurrentUser(data.user);
        setToken(data.token);
        setUser(data.user);
      } else {
        throw new Error(data.message || 'Giriş başarısız');
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
