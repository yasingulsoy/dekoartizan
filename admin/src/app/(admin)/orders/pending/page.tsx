import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Bekleyen Siparişler - dekoartizan Admin",
  description: "Bekleyen siparişleri görüntüleyin",
};

export default function PendingOrdersPage() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-4">
        Bekleyen Siparişler
      </h1>
      <p className="text-gray-500 dark:text-gray-400">
        Bekleyen sipariş listesi yakında eklenecek...
      </p>
    </div>
  );
}
