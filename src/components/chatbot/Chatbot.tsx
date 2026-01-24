'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Loader2, Plus, Trash2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_URL } from '@/lib/api';
import Image from 'next/image';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Merhaba! Ben dekoartizan tasarım asistanınız. Size nasıl yardımcı olabilirim? Marka bilgilerinize göre tasarım önerileri sunabilirim. 🎨',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Session ID'yi yükle veya oluştur
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let storedSessionId = localStorage.getItem('chatbot_session_id');
      if (!storedSessionId) {
        // UUID benzeri bir ID oluştur
        storedSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('chatbot_session_id', storedSessionId);
      }
      setSessionId(storedSessionId);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Cookie'leri gönder
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          sessionId: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('API yanıtı alınamadı');
      }

      const data = await response.json();

      // Session ID güncellenmişse kaydet
      if (data.sessionId && data.sessionId !== sessionId) {
        setSessionId(data.sessionId);
        if (typeof window !== 'undefined') {
          localStorage.setItem('chatbot_session_id', data.sessionId);
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chatbot hatası:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Üzgünüm, bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Yeni sohbet başlat
  const startNewChat = () => {
    if (confirm('Yeni bir sohbet başlatmak istediğinize emin misiniz? Mevcut sohbet kaydedilecek.')) {
      // Yeni session ID oluştur
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('chatbot_session_id', newSessionId);
      }
      
      // Mesajları sıfırla
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: 'Merhaba! Ben dekoartizan tasarım asistanınız. Size nasıl yardımcı olabilirim? Marka bilgilerinize göre tasarım önerileri sunabilirim. 🎨',
          timestamp: new Date(),
        },
      ]);
    }
  };

  // Sohbeti temizle
  const clearChat = () => {
    if (confirm('Sohbeti temizlemek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: 'Sohbet temizlendi. Size nasıl yardımcı olabilirim?',
          timestamp: new Date(),
        },
      ]);
    }
  };

  // WhatsApp'a yönlendir
  const openWhatsApp = () => {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "905551234567";
    const whatsappMessage = "Merhaba, dekoartizan hakkında bilgi almak istiyorum.";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-6 right-4 md:right-6 z-[60] flex items-center justify-center',
          'w-14 h-14 rounded-full shadow-lg',
          'bg-primary text-primary-foreground',
          'hover:bg-primary/90 transition-all duration-300',
          'hover:scale-110',
          isOpen && 'hidden'
        )}
        aria-label="Chatbot'u aç"
      >
        <MessageCircle className="w-6 h-6" />
        {messages.length > 1 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
            {messages.length - 1}
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={cn(
            'fixed bottom-6 right-4 md:right-6 z-[60]',
            'w-[90vw] max-w-md h-[600px] max-h-[80vh]',
            'bg-white rounded-lg shadow-2xl',
            'flex flex-col',
            'border border-gray-200'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-2">
              <Image
                src="/images/LOGO.svg"
                alt="dekoartizan Logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <h3 className="font-semibold">Tasarım Asistanı</h3>
            </div>
            <div className="flex items-center gap-2">
              {/* Yeni Sohbet */}
              <button
                onClick={startNewChat}
                className="hover:bg-primary/80 rounded-full p-1.5 transition-colors"
                aria-label="Yeni sohbet başlat"
                title="Yeni Sohbet"
              >
                <Plus className="w-4 h-4" />
              </button>
              {/* Sohbeti Temizle */}
              <button
                onClick={clearChat}
                className="hover:bg-primary/80 rounded-full p-1.5 transition-colors"
                aria-label="Sohbeti temizle"
                title="Sohbeti Temizle"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              {/* WhatsApp */}
              <button
                onClick={openWhatsApp}
                className="hover:bg-[#25D366]/20 rounded-full p-1.5 transition-colors group"
                aria-label="WhatsApp ile iletişime geç"
                title="WhatsApp ile İletişim"
              >
                <MessageSquare className="w-4 h-4 group-hover:text-[#25D366]" />
              </button>
              {/* Kapat */}
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-primary/80 rounded-full p-1 transition-colors"
                aria-label="Chatbot'u kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex items-start gap-2',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
                    <Image
                      src="/images/LOGO.svg"
                      alt="dekoartizan Logo"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[80%] rounded-lg px-4 py-2',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gray-100 text-gray-900'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString('tr-TR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
                    {typeof window !== 'undefined' && localStorage.getItem('user_name')
                      ? localStorage.getItem('user_name')?.charAt(0).toUpperCase() || 'U'
                      : 'U'}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-2 justify-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/images/LOGO.svg"
                    alt="dekoartizan Logo"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </div>
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Mesajınızı yazın..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Marka bilgilerinizi paylaşın, size özel tasarım önerileri sunalım!
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
