"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  cropped_image_url?: string;
  crop_width?: number;
  crop_height?: number;
  product?: {
    id: number;
    main_image_url?: string;
  };
}

interface Order {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  total_amount: number;
  currency: string;
  user: {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
  };
  items: OrderItem[];
  created_at: string;
  tracking_number?: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/orders/${orderId}`);
      const result = await response.json();

      if (result.success) {
        setOrder(result.data);
      }
    } catch (error) {
      console.error("Sipariş yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Yükleniyor...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Sipariş bulunamadı</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Sipariş Detayları
          </h1>
          <p className="text-gray-500 mt-1">Sipariş #{order.order_number}</p>
        </div>
        <Link
          href="/orders"
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
        >
          ← Geri Dön
        </Link>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h2 className="text-lg font-semibold mb-4">Sipariş Ürünleri</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                {item.cropped_image_url ? (
                  <>
                    <Image
                      src={`${API_URL}${item.cropped_image_url}`}
                      alt={item.product_name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">
                      Kırpılmış
                    </div>
                  </>
                ) : item.product?.main_image_url ? (
                  <Image
                    src={`${API_URL}${item.product.main_image_url}`}
                    alt={item.product_name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-medium text-gray-900 dark:text-white/90 mb-1">
                  {item.product_name}
                </h3>
                <p className="text-sm text-gray-500">Adet: {item.quantity}</p>
                {item.crop_width && item.crop_height && (
                  <p className="text-xs text-gray-500 mt-1">
                    Ölçü: {item.crop_width}cm × {item.crop_height}cm
                  </p>
                )}
                <p className="text-sm font-medium text-gray-900 dark:text-white/90 mt-2">
                  {item.total_price.toFixed(2)} {order.currency}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
