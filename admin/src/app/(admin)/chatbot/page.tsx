"use client";

import React, { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import Link from "next/link";
import { ChatIcon, TimeIcon, UserCircleIcon } from "@/icons";

interface Conversation {
  id: number;
  sessionId: string;
  customer: {
    id: number;
    email: string;
    name: string;
  } | null;
  status: string;
  metadata: any;
  createdAt: string;
  updatedAt: string;
}

export default function ChatbotPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");

  useEffect(() => {
    fetchConversations();
  }, [page, statusFilter]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });
      if (statusFilter) {
        params.append("status", statusFilter);
      }
      const data = await apiGet<{
        success: boolean;
        conversations: Conversation[];
        pagination: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }>(`/api/chatbot/conversations?${params.toString()}`);

      setConversations(data.conversations);
      setTotalPages(data.pagination.totalPages);
    } catch (err: any) {
      setError(err.message || "Konuşmalar yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("tr-TR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      archived: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusColors[status] || statusColors.active
        }`}
      >
        {status === "active"
          ? "Aktif"
          : status === "completed"
          ? "Tamamlandı"
          : "Arşivlendi"}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
              Chatbot Geçmişi
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Tüm chatbot konuşmalarını görüntüleyin ve yönetin
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Tüm Durumlar</option>
            <option value="active">Aktif</option>
            <option value="completed">Tamamlandı</option>
            <option value="archived">Arşivlendi</option>
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Yükleniyor...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-800 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Conversations List */}
        {!loading && !error && (
          <>
            {conversations.length === 0 ? (
              <div className="text-center py-12">
                <ChatIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Henüz konuşma bulunmamaktadır.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Session ID
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Müşteri
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Durum
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Oluşturulma
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {conversations.map((conversation) => (
                      <tr
                        key={conversation.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <ChatIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900 dark:text-white font-mono">
                              {conversation.sessionId.substring(0, 20)}...
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {conversation.customer ? (
                            <div className="flex items-center gap-2">
                              <UserCircleIcon className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {conversation.customer.name || "İsimsiz"}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {conversation.customer.email}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Misafir
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(conversation.status)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <TimeIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {formatDate(conversation.createdAt)}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Link
                            href={`/chatbot/${conversation.id}`}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                          >
                            Sohbeti Görüntüle
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Önceki
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Sayfa {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Sonraki
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
