"use client";
import React from "react";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/products/ProductForm";
import { API_URL } from "@/lib/api";

export default function NewProductPage() {
  const router = useRouter();

  const handleSubmit = async (formData: any, images: File[]) => {
    try {
      // Önce ürünü oluştur
      const productResponse = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const productResult = await productResponse.json();

      if (!productResult.success) {
        throw new Error(productResult.error || "Ürün oluşturulamadı");
      }

      const productId = productResult.data.id;

      // Resimleri yükle
      if (images.length > 0) {
        const formDataImages = new FormData();
        images.forEach((image) => {
          formDataImages.append("images", image);
        });

        const imagesResponse = await fetch(
          `${API_URL}/api/products/${productId}/images`,
          {
            method: "POST",
            body: formDataImages,
          }
        );

        const imagesResult = await imagesResponse.json();

        if (!imagesResult.success) {
          throw new Error(imagesResult.error || "Resimler yüklenemedi");
        }
      }

      // Başarılı, ürünler sayfasına yönlendir
      router.push("/products");
      router.refresh();
    } catch (error: any) {
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <h1 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Yeni Ürün Ekle
        </h1>
      </div>
      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
}
