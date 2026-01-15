"use client";
import React, { useState, useEffect } from "react";
import Button from "../ui/button/Button";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  discount_price?: number;
  stock_quantity: number;
  is_active: boolean;
  is_archived: boolean;
  is_featured: boolean;
  main_image_url?: string;
  category?: { name: string };
}

const ProductList: React.FC = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "archived">("all");

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter === "active") params.append("is_active", "true");
      if (filter === "archived") params.append("is_archived", "true");

      const response = await fetch(
        `http://localhost:5000/api/products?${params.toString()}`
      );
      const result = await response.json();

      if (result.success) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error("Ürünler yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (productId: number, isArchived: boolean) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${productId}/archive`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_archived: !isArchived }),
        }
      );

      const result = await response.json();
      if (result.success) {
        fetchProducts();
      }
    } catch (error) {
      console.error("Arşivleme hatası:", error);
    }
  };

  const handleStatus = async (productId: number, isActive: boolean) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${productId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_active: !isActive }),
        }
      );

      const result = await response.json();
      if (result.success) {
        fetchProducts();
      }
    } catch (error) {
      console.error("Durum güncelleme hatası:", error);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz? Tüm resimler de silinecektir.")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${productId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();
      if (result.success) {
        fetchProducts();
      }
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtreler ve Butonlar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              filter === "all"
                ? "bg-brand-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              filter === "active"
                ? "bg-brand-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
            }`}
          >
            Aktif
          </button>
          <button
            onClick={() => setFilter("archived")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              filter === "archived"
                ? "bg-brand-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
            }`}
          >
            Arşivlenmiş
          </button>
        </div>

        <Button onClick={() => router.push("/products/new")}>
          Yeni Ürün Ekle
        </Button>
      </div>

      {/* Ürün Listesi */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Resim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Ürün Adı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Fiyat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Stok
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Durum
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-white/[0.03]">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Ürün bulunamadı
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      {product.main_image_url ? (
                        <img
                          src={`http://localhost:5000${product.main_image_url}`}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700">
                          <svg
                            className="h-6 w-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white/90">
                        {product.name}
                      </div>
                      {product.category && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {product.category.name}
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {product.sku}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white/90">
                      <div>
                        {product.discount_price ? (
                          <>
                            <span className="text-red-600 line-through">
                              ₺{product.price.toFixed(2)}
                            </span>
                            <span className="ml-2 font-semibold">
                              ₺{product.discount_price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span>₺{product.price.toFixed(2)}</span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {product.stock_quantity}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            product.is_active
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                          }`}
                        >
                          {product.is_active ? "Aktif" : "Pasif"}
                        </span>
                        {product.is_archived && (
                          <span className="inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                            Arşivlenmiş
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/products/${product.id}/edit`)}
                          className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() =>
                            handleStatus(product.id, product.is_active)
                          }
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {product.is_active ? "Pasif Yap" : "Aktif Yap"}
                        </button>
                        <button
                          onClick={() =>
                            handleArchive(product.id, product.is_archived)
                          }
                          className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                        >
                          {product.is_archived ? "Yayına Al" : "Arşivle"}
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
