"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

interface Customer {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  birth_date: string | null;
  gender: "male" | "female" | "other" | null;
  avatar_url: string | null;
  auth_provider: "email" | "google";
  is_email_verified: boolean;
  created_at: string;
  last_login: string | null;
}

interface AuthContextType {
  customer: Customer | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshCustomer: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Token'ı localStorage'dan yükle
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      setToken(storedToken);
      // Token'dan kullanıcı bilgilerini al
      verifyToken(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (tokenToVerify: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: tokenToVerify }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        setCustomer(data.data);
        setToken(tokenToVerify);
      } else {
        // Token geçersiz, temizle
        localStorage.removeItem("auth_token");
        setToken(null);
        setCustomer(null);
      }
    } catch (error) {
      console.error("Token doğrulama hatası:", error);
      localStorage.removeItem("auth_token");
      setToken(null);
      setCustomer(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (newToken: string) => {
    localStorage.setItem("auth_token", newToken);
    setToken(newToken);
    await verifyToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setToken(null);
    setCustomer(null);
    router.push("/signin");
  };

  const refreshCustomer = async () => {
    if (token && customer) {
      try {
        const response = await fetch(`${API_URL}/api/customers/${customer.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.data) {
          // Sequelize model instance'ını plain object'e çevir
          const customerData = data.data.toJSON ? data.data.toJSON() : data.data;
          console.log("Güncellenmiş customer verisi:", customerData);
          setCustomer(customerData);
        } else {
          console.error("refreshCustomer: Başarısız response", data);
        }
      } catch (error) {
        console.error("Kullanıcı bilgileri yenileme hatası:", error);
        // Hata durumunda token ile tekrar dene
        if (token) {
          await verifyToken(token);
        }
      }
    } else if (token) {
      await verifyToken(token);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        token,
        isAuthenticated: !!customer && !!token,
        isLoading,
        login,
        logout,
        refreshCustomer,
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
