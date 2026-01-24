"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import { ChatIcon, UserCircleIcon, TimeIcon, ChevronLeftIcon } from "@/icons";

interface Message {
  id: number;
  role: "user" | "assistant" | "system";
  content: string;
  messageOrder: number;
  createdAt: string;
}

interface Conversation {
  id: number;
  sessionId: string;
  status: string;
  metadata: any;
  createdAt: string;
  messages: Message[];
}

export default function ChatbotDetailPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id as string;
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (conversationId) {
      fetchConversation();
    }
  }, [conversationId]);

  const fetchConversation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Conversation ID ile direkt mesajları getir (backend artık ID'yi de kabul ediyor)
      const data = await apiGet<{
        success: boolean;
        conversation: Conversation;
      }>(`/api/chatbot/conversations/${conversationId}`);

      setConversation(data.conversation);
    } catch (err: any) {
      setError(err.message || "Konuşma yüklenirken bir hata oluştu");
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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-400">{error}</p>
            <button
              onClick={() => router.push("/chatbot")}
              className="mt-4 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Geri Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/chatbot")}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                Chatbot Sohbeti
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Session ID: <span className="font-mono">{conversation.sessionId}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <TimeIcon className="w-4 h-4 inline mr-1" />
                {formatDate(conversation.createdAt)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {conversation.messages.length} mesaj
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <div className="space-y-4 max-h-[600px] overflow-y-auto p-4">
          {conversation.messages.length === 0 ? (
            <div className="text-center py-12">
              <ChatIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Bu konuşmada henüz mesaj bulunmamaktadır.
              </p>
            </div>
          ) : (
            conversation.messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/20 dark:border-primary/30 flex items-center justify-center">
                    <ChatIcon className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={`text-xs mt-2 ${
                      message.role === "user"
                        ? "text-white/70"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {formatTime(message.createdAt)}
                  </p>
                </div>
                {message.role === "user" && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold">
                    <UserCircleIcon className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Metadata */}
      {conversation.metadata && Object.keys(conversation.metadata).length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
            Ek Bilgiler
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
              {JSON.stringify(conversation.metadata, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
