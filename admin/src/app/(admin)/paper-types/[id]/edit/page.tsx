"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import PaperTypeForm from "@/components/paper-types/PaperTypeForm";
import { API_URL } from "@/lib/api";

export default function EditPaperTypePage() {
  const router = useRouter();
  const params = useParams();
  const paperTypeId = params?.id as string;
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (paperTypeId) {
      fetchPaperType();
    }
  }, [paperTypeId]);

  const fetchPaperType = async () => {
    try {
      const response = await fetch(`${API_URL}/api/paper-types/${paperTypeId}`);
      const result = await response.json();

      if (result.success) {
        setInitialData(result.data);
      } else {
        throw new Error(result.error || "Kağıt türü bulunamadı");
      }
    } catch (error) {
      console.error("Kağıt türü yüklenemedi:", error);
      router.push("/paper-types");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: any, image: File | null, removeImage?: boolean) => {
    try {
      const submitFormData = new FormData();
      submitFormData.append("name", formData.name);
      submitFormData.append("price", formData.price);
      submitFormData.append("price_per_m2", formData.price_per_m2);
      submitFormData.append("description", JSON.stringify(formData.description));
      submitFormData.append("is_active", formData.is_active.toString());
      submitFormData.append("display_order", formData.display_order);

      if (image) {
        submitFormData.append("image", image);
      } else if (removeImage) {
        // Resim kaldırılmak isteniyorsa
        submitFormData.append("remove_image", "true");
      }

      const response = await fetch(`${API_URL}/api/paper-types/${paperTypeId}`, {
        method: "PUT",
        body: submitFormData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Kağıt türü güncellenemedi");
      }

      router.push("/paper-types");
      router.refresh();
    } catch (error: any) {
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
          <div className="text-center py-10">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  if (!initialData) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <h1 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Kağıt Türünü Düzenle
        </h1>
      </div>
      <PaperTypeForm
        paperTypeId={parseInt(paperTypeId)}
        onSubmit={handleSubmit}
        initialData={initialData}
      />
    </div>
  );
}
