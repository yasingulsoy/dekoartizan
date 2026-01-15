"use client";
import React from "react";
import OrderList from "@/components/orders/OrderList";

export default function PendingOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <h1 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Bekleyen Siparişler
        </h1>
      </div>
      <OrderList status="pending" />
    </div>
  );
}
