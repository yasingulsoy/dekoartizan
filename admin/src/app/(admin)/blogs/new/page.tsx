"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BlogForm from "@/components/blogs/BlogForm";
import { API_URL } from "@/lib/api";
import { getAuthToken } from "@/lib/api";

export default function NewBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: any, imageFile?: File) => {
    setLoading(true);
    try {
      // Önce blogu oluştur
      const response = await fetch(`${API_URL}/api/blogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Blog oluşturulamadı");
      }

      const blogId = result.data.id;

      // Eğer resim varsa yükle
      if (imageFile) {
        const formDataImage = new FormData();
        formDataImage.append("image", imageFile);

        const imageResponse = await fetch(`${API_URL}/api/blogs/${blogId}/image`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
          credentials: "include",
          body: formDataImage,
        });

        const imageResult = await imageResponse.json();
        if (!imageResult.success) {
          console.error("Resim yükleme hatası:", imageResult.error);
        }
      }

      router.push("/blogs");
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
        Yeni Blog Yazısı
      </h1>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <BlogForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
