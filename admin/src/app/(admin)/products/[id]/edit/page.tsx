"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ProductForm from "@/components/products/ProductForm";
import { API_URL } from "@/lib/api";

interface Product {
  id: number;
  name: string;
  sku: string;
  slug: string;
  category_id?: number;
  sub_category_id?: number;
  short_description?: string;
  description?: string;
  price: number;
  discount_price?: number;
  discount_percentage?: number;
  stock_quantity: number;
  min_order_quantity?: number;
  max_order_quantity?: number;
  weight?: number;
  dimensions?: string;
  is_featured: boolean;
  is_new?: boolean;
  is_on_sale?: boolean;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  images?: Array<{
    id: number;
    image_url: string;
    is_primary?: boolean;
    display_order?: number;
  }>;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products/${productId}`);
      const result = await response.json();

      if (result.success) {
        setProduct(result.data);
      } else {
        setError(result.error || "Ürün bulunamadı");
        setTimeout(() => {
          router.push("/products");
        }, 2000);
      }
    } catch (error) {
      console.error("Ürün yüklenemedi:", error);
      setError("Ürün yüklenirken bir hata oluştu");
      setTimeout(() => {
        router.push("/products");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: any, images: File[]) => {
    try {
      // Ürünü güncelle
      const response = await fetch(`${API_URL}/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Ürün güncellenemedi");
      }

      // Yeni resimler varsa yükle
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
          console.error("Resim yükleme hatası:", imagesResult.error);
          // Resim yükleme hatası olsa bile ürün güncellendi, devam et
        }
      }

      // Başarılı, ürünler sayfasına yönlendir
      router.push("/products");
      router.refresh();
    } catch (error: any) {
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Ürünler sayfasına yönlendiriliyorsunuz...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  // Resimleri formatla
  const formattedImages = product.images
    ? product.images
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
        .map((img) => ({
          id: img.id,
          url: img.image_url,
          is_primary: img.is_primary,
          display_order: img.display_order,
        }))
    : [];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <h1 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Ürünü Düzenle
        </h1>
      </div>
      <ProductForm
        productId={parseInt(productId)}
        onSubmit={handleSubmit}
        initialData={{
          name: product.name,
          sku: product.sku,
          category_id: product.category_id?.toString() || "",
          sub_category_id: product.sub_category_id?.toString() || "",
          short_description: product.short_description || "",
          description: product.description || "",
          price: product.price.toString(),
          discount_price: product.discount_price?.toString() || "",
          discount_percentage: product.discount_percentage?.toString() || "",
          stock_quantity: product.stock_quantity.toString(),
          min_order_quantity: product.min_order_quantity?.toString() || "1",
          max_order_quantity: product.max_order_quantity?.toString() || "",
          weight: product.weight?.toString() || "",
          dimensions: product.dimensions || "",
          is_featured: product.is_featured,
          is_new: product.is_new || false,
          is_on_sale: product.is_on_sale || false,
          meta_title: product.meta_title || "",
          meta_description: product.meta_description || "",
          meta_keywords: product.meta_keywords || "",
        }}
        initialImages={formattedImages}
      />
    </div>
  );
}
