"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { poppins } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/api";

interface Address {
  id: number;
  address_type: string;
  title: string | null;
  first_name: string;
  last_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  province: string | null;
  district: string | null;
  neighborhood: string | null;
  city: string;
  state: string | null;
  postal_code: string;
  country: string;
  is_default: boolean;
  is_active: boolean;
}

export default function AddressesPage() {
  const { customer, isAuthenticated, isLoading, token } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchAddresses();
    }
  }, [isAuthenticated, token]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setAddresses(data.data);
      } else {
        setError(data.error || "Adresler yüklenirken bir hata oluştu");
      }
    } catch (err) {
      console.error("Adres yükleme hatası:", err);
      setError("Adresler yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu adresi silmek istediğinize emin misiniz?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/addresses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        fetchAddresses();
      } else {
        alert(data.error || "Adres silinirken bir hata oluştu");
      }
    } catch (err) {
      console.error("Adres silme hatası:", err);
      alert("Adres silinirken bir hata oluştu");
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/api/addresses/${id}/set-default`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        fetchAddresses();
      } else {
        alert(data.error || "Varsayılan adres belirlenirken bir hata oluştu");
      }
    } catch (err) {
      console.error("Varsayılan adres belirleme hatası:", err);
      alert("Varsayılan adres belirlenirken bir hata oluştu");
    }
  };

  if (isLoading || loading) {
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Başlık */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1
                className={cn([
                  poppins.className,
                  "text-3xl lg:text-4xl font-bold mb-2",
                ])}
              >
                Adreslerim
              </h1>
              <p className="text-gray-600">Teslimat adreslerinizi yönetin</p>
            </div>
            <Link href="/profil/adreslerim/yeni">
              <Button>+ Yeni Adres Ekle</Button>
            </Link>
          </div>
          <Link
            href="/profil"
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            ← Profilime Dön
          </Link>
        </div>

        {/* Hata Mesajı */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Adres Listesi */}
        {addresses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Henüz adres eklenmemiş
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              İlk adresinizi ekleyerek başlayın
            </p>
            <div className="mt-6">
              <Link href="/profil/adreslerim/yeni">
                <Button>Yeni Adres Ekle</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={cn(
                  "bg-white rounded-lg shadow-sm p-6 border-2",
                  address.is_default
                    ? "border-black"
                    : "border-gray-200"
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {address.is_default && (
                      <span className="inline-block mb-2 px-2 py-1 bg-black text-white text-xs rounded">
                        Varsayılan
                      </span>
                    )}
                    {address.title && (
                      <h3 className="text-lg font-semibold mb-1">
                        {address.title}
                      </h3>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/profil/adreslerim/${address.id}/duzenle`}>
                      <button className="text-gray-600 hover:text-gray-900">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="space-y-1 text-sm text-gray-600">
                  <p className="font-medium text-gray-900">
                    {address.first_name} {address.last_name}
                  </p>
                  <p>{address.phone}</p>
                  <p className="mt-2">
                    {address.address_line1}
                    {address.address_line2 && `, ${address.address_line2}`}
                  </p>
                  <p>
                    {address.neighborhood && `${address.neighborhood}, `}
                    {address.district && `${address.district}, `}
                    {address.province && `${address.province}, `}
                    {address.city}
                    {address.state && `, ${address.state}`}
                  </p>
                  <p>
                    {address.postal_code} {address.country}
                  </p>
                </div>

                {!address.is_default && (
                  <div className="mt-4 pt-4 border-t">
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Varsayılan adres yap
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
