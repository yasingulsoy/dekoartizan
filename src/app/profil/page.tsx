"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { poppins } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { customer, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !customer) {
    return null;
  }

  const fullName = [customer.first_name, customer.last_name].filter(Boolean).join(" ") || "Kullanıcı";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Başlık */}
        <div className="mb-8">
          <h1
            className={cn([
              poppins.className,
              "text-3xl lg:text-4xl font-bold mb-2",
            ])}
          >
            Profilim
          </h1>
          <p className="text-gray-600">Hesap bilgilerinizi görüntüleyin ve yönetin</p>
        </div>

        {/* E-posta Doğrulama Uyarısı */}
        {!customer.is_email_verified && customer.auth_provider === "email" && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-yellow-800">
                  E-posta Adresiniz Doğrulanmadı
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    E-posta adresinizi doğrulamak için gönderdiğimiz e-postayı kontrol edin.
                    E-postayı almadıysanız tekrar gönderebilirsiniz.
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    href="/verify-email"
                    className="text-sm font-medium text-yellow-800 hover:text-yellow-900 underline"
                  >
                    Doğrulama E-postasını Tekrar Gönder →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol Taraf - Profil Kartı */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden flex items-center justify-center">
                  {customer.avatar_url ? (
                    <Image
                      src={customer.avatar_url}
                      alt={fullName}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl font-bold">
                      {fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-semibold mb-1">{fullName}</h2>
                <p className="text-gray-500 text-sm">{customer.email}</p>
                {customer.is_email_verified && (
                  <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    ✓ E-posta Doğrulandı
                  </span>
                )}
              </div>

              {/* Hızlı Linkler */}
              <div className="space-y-2 border-t pt-4">
                <Link
                  href="/orders"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  📦 Siparişlerim
                </Link>
                <Link
                  href="/profil/adreslerim"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  📍 Adreslerim
                </Link>
                <Link
                  href="/cart"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  🛒 Sepetim
                </Link>
                <button
                  onClick={logout}
                  className="w-full mt-4 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-left"
                >
                  🚪 Çıkış Yap
                </button>
              </div>
            </div>
          </div>

          {/* Sağ Taraf - Detaylar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Kişisel Bilgiler */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Kişisel Bilgiler</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ad
                  </label>
                  <p className="text-gray-900">{customer.first_name || "-"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Soyad
                  </label>
                  <p className="text-gray-900">{customer.last_name || "-"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-posta
                  </label>
                  <p className="text-gray-900">{customer.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giriş Yöntemi
                  </label>
                  <p className="text-gray-900">
                    {customer.auth_provider === "google" ? "Google" : "E-posta"}
                  </p>
                </div>
              </div>
            </div>

            {/* Hesap Bilgileri */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Hesap Bilgileri</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hesap Oluşturma Tarihi
                  </label>
                  <p className="text-gray-900">
                    {new Date(customer.created_at).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                {customer.last_login && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Son Giriş Tarihi
                    </label>
                    <p className="text-gray-900">
                      {new Date(customer.last_login).toLocaleDateString("tr-TR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
