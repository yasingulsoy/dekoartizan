"use client";
import React, { useState, useEffect } from "react";
import Button from "../ui/button/Button";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";
import Image from "next/image";

interface PaperType {
  id: number;
  name: string;
  slug: string;
  price: number;
  price_per_m2: number;
  description: string[];
  image_url?: string;
  is_active: boolean;
  display_order: number;
}

const PaperTypeList: React.FC = () => {
  const router = useRouter();
  const [paperTypes, setPaperTypes] = useState<PaperType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  useEffect(() => {
    fetchPaperTypes();
  }, [filter]);

  const fetchPaperTypes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter === "active") params.append("include_inactive", "false");
      if (filter === "inactive") params.append("include_inactive", "true");

      const response = await fetch(
        `${API_URL}/api/paper-types?${params.toString()}`
      );
      const result = await response.json();

      if (result.success) {
        const filtered = filter === "inactive" 
          ? result.data.filter((pt: PaperType) => !pt.is_active)
          : filter === "active"
          ? result.data.filter((pt: PaperType) => pt.is_active)
          : result.data;
        setPaperTypes(filtered);
      }
    } catch (error) {
      console.error("Kağıt türleri yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (paperTypeId: number, isActive: boolean) => {
    try {
      const response = await fetch(
        `${API_URL}/api/paper-types/${paperTypeId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_active: !isActive }),
        }
      );

      const result = await response.json();
      if (result.success) {
        fetchPaperTypes();
      }
    } catch (error) {
      console.error("Durum güncelleme hatası:", error);
    }
  };

  const handleDelete = async (paperTypeId: number) => {
    if (!confirm("Bu kağıt türünü silmek istediğinize emin misiniz? Resim de silinecektir.")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/paper-types/${paperTypeId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();
      if (result.success) {
        fetchPaperTypes();
      } else {
        alert(result.error || "Silme işlemi başarısız");
      }
    } catch (error) {
      console.error("Silme hatası:", error);
      alert("Silme işlemi sırasında bir hata oluştu");
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <div className="text-center py-10">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "active"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Aktif
          </button>
          <button
            onClick={() => setFilter("inactive")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "inactive"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pasif
          </button>
        </div>
        <Button
          onClick={() => router.push("/paper-types/new")}
          className="bg-black text-white hover:bg-gray-800"
        >
          Yeni Kağıt Türü Ekle
        </Button>
      </div>

      {paperTypes.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          Kağıt türü bulunamadı
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  Resim
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  Ad
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  Fiyat
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  m² Fiyatı
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  Sıra
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  Durum
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {paperTypes.map((paperType) => (
                <tr
                  key={paperType.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="py-3 px-4">
                    {paperType.image_url ? (
                      <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={`${API_URL}${paperType.image_url}`}
                          alt={paperType.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">Resim Yok</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {paperType.name}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {paperType.price.toFixed(2)} ₺
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {paperType.price_per_m2.toFixed(2)} ₺ / m²
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {paperType.display_order}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleStatus(paperType.id, paperType.is_active)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        paperType.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {paperType.is_active ? "Aktif" : "Pasif"}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => router.push(`/paper-types/${paperType.id}/edit`)}
                        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(paperType.id)}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaperTypeList;
