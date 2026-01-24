"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

const WhatsAppButton = () => {
  // WhatsApp numarasını buraya ekleyin (örn: 905551234567)
  const whatsappNumber = "905551234567"; // Örnek numara, gerçek numarayla değiştirin
  const whatsappMessage = "Merhaba, dekoartizan hakkında bilgi almak istiyorum.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <Link
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-4 md:right-6 z-40 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-3 md:p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      aria-label="WhatsApp ile iletişime geç"
    >
      <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
    </Link>
  );
};

export default WhatsAppButton;
