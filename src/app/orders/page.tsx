"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiGet } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { poppins } from "@/styles/fonts";
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
  currency: string;
  tracking_number?: string;
  created_at: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const { customer, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (!customer?.id) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await apiGet<{
          success: boolean;
          data: Order[];
          pagination?: {
            total: number;
            page: number;
            limit: number;
            pages: number;
          };
        }>(`/api/orders/user/${customer.id}`);
        
        if (response.success) {
          setOrders(response.data);
        } else {
          setError("Siparişler yüklenirken bir hata oluştu");
        }
      } catch (err) {
        console.error("Sipariş yükleme hatası:", err);
        setError("Siparişler yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customer?.id]);

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
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            href="/signin"
            className="inline-block px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Başlık */}
        <div className="mb-8">
          <h1
            className={cn([
              poppins.className,
              "text-3xl lg:text-4xl font-bold mb-2",
            ])}
          >
            Siparişlerim
          </h1>
          <p className="text-gray-600">
            Tüm siparişlerinizi buradan görüntüleyebilirsiniz
          </p>
        </div>

        {/* Siparişler Listesi */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">
              Henüz siparişiniz bulunmamaktadır.
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Sipariş Başlığı */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        Sipariş #{order.order_number}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <span
                        className={cn([
                          "px-3 py-1 rounded-full text-sm font-medium",
                          getStatusColor(order.order_status_code),
                        ])}
                      >
                        {order.orderStatus?.name_tr || "Bilinmiyor"}
                      </span>
                      <span className="text-lg font-bold">
                        ₺{parseFloat(order.total_amount.toString()).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  {order.tracking_number && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Takip No:</span>{" "}
                        {order.tracking_number}
                      </p>
                    </div>
                  )}
                </div>

                {/* Sipariş Ürünleri */}
                <div className="p-6">
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
                            href={`/magaza/urunler/${item.product.slug || item.product.name.toLowerCase().split(" ").join("-")}`}
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

                {/* Sipariş Detay Linki */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-sm font-medium text-black hover:text-gray-600"
                  >
                    Sipariş Detaylarını Görüntüle →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
