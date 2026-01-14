import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Siparişler - dekoartizan Admin",
  description: "Tüm siparişleri görüntüleyin ve yönetin",
};

export default function OrdersPage() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-4">
        Siparişler
      </h1>
      <p className="text-gray-500 dark:text-gray-400">
        Sipariş listesi yakında eklenecek...
      </p>
    </div>
  );
}
