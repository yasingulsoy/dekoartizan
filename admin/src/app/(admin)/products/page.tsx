import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Ürünler - dekoartizan Admin",
  description: "Tüm ürünleri görüntüleyin ve yönetin",
};

export default function ProductsPage() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-4">
        Ürünler
      </h1>
      <p className="text-gray-500 dark:text-gray-400">
        Ürün listesi yakında eklenecek...
      </p>
    </div>
  );
}
