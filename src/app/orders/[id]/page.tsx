"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { integralCF } from "@/styles/fonts";
import { cn } from "@/lib/utils";

interface OrderStatus {
  code: number;
  name_tr: string;
  name_en?: string;
  description?: string;
}

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    slug: string;
    images?: Array<{ url: string }>;
  };
}

interface Order {
  id: number;
  order_number: string;
  order_status_code: number;
  orderStatus: OrderStatus;
  total_amount: number;
  subtotal: number;
  tax_amount: number;
  shipping_cost: number;
  discount_amount: number;
  currency: string;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  shipped_at?: string;
  delivered_at?: string;
  items: OrderItem[];
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await apiGet<{
          success: boolean;
          data: Order;
        }>(`/api/orders/${orderId}`);
        
        if (response.success) {
          setOrder(response.data);
        } else {
          setError("Sipariş bulunamadı");
        }
      } catch (err) {
        console.error("Sipariş yükleme hatası:", err);
        setError("Sipariş yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const getStatusColor = (code: number) => {
    switch (code) {
      case 0:
        return "bg-blue-100 text-blue-800";
      case 1:
        return "bg-yellow-100 text-yellow-800";
      case 2:
        return "bg-orange-100 text-orange-800";
      case 3:
        return "bg-purple-100 text-purple-800";
      case 4:
        return "bg-indigo-100 text-indigo-800";
      case 5:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusSteps = (order: Order) => {
    const steps = [
      { code: 0, name: "Alındı", completed: order.order_status_code >= 0 },
      { code: 1, name: "Hazırlanıyor", completed: order.order_status_code >= 1 },
      { code: 2, name: "Paketleniyor", completed: order.order_status_code >= 2 },
      { code: 3, name: "Kargoya Verilmek Üzere Yolda", completed: order.order_status_code >= 3 },
      { code: 4, name: "Kargo Firmasına Ulaştırıldı", completed: order.order_status_code >= 4 },
      { code: 5, name: "Teslim Edildi", completed: order.order_status_code >= 5 },
    ];
    return steps;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Sipariş yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">{error || "Sipariş bulunamadı"}</p>
          <Link
            href="/orders"
            className="inline-block px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Siparişlere Dön
          </Link>
        </div>
      </div>
    );
  }

  const statusSteps = getStatusSteps(order);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Geri Dön Butonu */}
        <Link
          href="/orders"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Siparişlere Dön
        </Link>

        {/* Başlık */}
        <div className="mb-8">
          <h1
            className={cn([
              integralCF.className,
              "text-3xl lg:text-4xl font-bold mb-2",
            ])}
          >
            Sipariş Detayları
          </h1>
          <p className="text-gray-600">Sipariş #{order.order_number}</p>
        </div>

        {/* Sipariş Durumu Timeline */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-6">Sipariş Durumu</h2>
          <div className="space-y-4">
            {statusSteps.map((step, index) => (
              <div key={step.code} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={cn([
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      step.completed
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-500",
                    ])}
                  >
                    {step.completed ? "✓" : index + 1}
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div
                      className={cn([
                        "w-0.5 h-12 mt-2",
                        step.completed ? "bg-black" : "bg-gray-200",
                      ])}
                    />
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <p
                    className={cn([
                      "text-sm font-medium",
                      step.completed ? "text-gray-900" : "text-gray-500",
                    ])}
                  >
                    {step.name}
                  </p>
                  {step.code === order.order_status_code && (
                    <p className="text-xs text-gray-500 mt-1">Mevcut durum</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <span
              className={cn([
                "inline-block px-3 py-1 rounded-full text-sm font-medium",
                getStatusColor(order.order_status_code),
              ])}
            >
              {order.orderStatus?.name_tr || "Bilinmiyor"}
            </span>
          </div>
        </div>

        {/* Sipariş Bilgileri */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Sipariş Bilgileri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Sipariş Tarihi</p>
              <p className="font-medium">{formatDate(order.created_at)}</p>
            </div>
            {order.tracking_number && (
              <div>
                <p className="text-sm text-gray-500">Takip Numarası</p>
                <p className="font-medium">{order.tracking_number}</p>
              </div>
            )}
            {order.shipped_at && (
              <div>
                <p className="text-sm text-gray-500">Kargoya Verilme Tarihi</p>
                <p className="font-medium">{formatDate(order.shipped_at)}</p>
              </div>
            )}
            {order.delivered_at && (
              <div>
                <p className="text-sm text-gray-500">Teslim Tarihi</p>
                <p className="font-medium">{formatDate(order.delivered_at)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sipariş Ürünleri */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Sipariş Ürünleri</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.product.images && item.product.images[0] ? (
                    <Image
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      width={80}
                      height={80}
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
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/shop/product/${item.product.slug}`}
                    className="text-base font-medium text-gray-900 hover:text-gray-600 block mb-1"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-gray-500">
                    Adet: {item.quantity}
                  </p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    ₺{parseFloat(item.price.toString()).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sipariş Özeti */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Sipariş Özeti</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Ara Toplam</span>
              <span className="font-medium">
                ₺{parseFloat(order.subtotal.toString()).toFixed(2)}
              </span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">İndirim</span>
                <span className="font-medium text-red-600">
                  -₺{parseFloat(order.discount_amount.toString()).toFixed(2)}
                </span>
              </div>
            )}
            {order.tax_amount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Vergi</span>
                <span className="font-medium">
                  ₺{parseFloat(order.tax_amount.toString()).toFixed(2)}
                </span>
              </div>
            )}
            {order.shipping_cost > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Kargo</span>
                <span className="font-medium">
                  ₺{parseFloat(order.shipping_cost.toString()).toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
              <span>Toplam</span>
              <span>₺{parseFloat(order.total_amount.toString()).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
