"use client";
import React from "react";
import { useRouter } from "next/navigation";
import PaperTypeForm from "@/components/paper-types/PaperTypeForm";
import { API_URL } from "@/lib/api";

export default function NewPaperTypePage() {
  const router = useRouter();

  const handleSubmit = async (formData: any, image: File | null) => {
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
      }

      const response = await fetch(`${API_URL}/api/paper-types`, {
        method: "POST",
        body: submitFormData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Kağıt türü oluşturulamadı");
      }

      router.push("/paper-types");
      router.refresh();
    } catch (error: any) {
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <h1 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Yeni Kağıt Türü Ekle
        </h1>
      </div>
      <PaperTypeForm onSubmit={handleSubmit} />
    </div>
  );
}
