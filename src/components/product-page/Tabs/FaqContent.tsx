import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FaqItem = {
  question: string;
  answer: string;
};

const faqsData: FaqItem[] = [
  {
    question: "Tişörtün kumaşı nedir?",
    answer:
      "Kumaş tipi (örneğin, pamuk, polyester, karışım), ağırlık ve özel özellikler hakkında detaylar sağlayın.",
  },
  {
    question: "Tişört için bakım talimatları nelerdir?",
    answer:
      "Kaliteyi ve dayanıklılığı korumak için önerilen yıkama, kurutma ve ütüleme yöntemlerini belirtin.",
  },
  {
    question: "Tişörtteki tasarım veya baskı neyden yapılmıştır?",
    answer:
      "Tasarım için kullanılan malzemeyi (örneğin, vinil, serigrafi baskı, nakış) ve dayanıklılığını açıklayın.",
  },
  {
    question: "Tişört unisex mi yoksa belirli bir cinsiyet için mi tasarlanmış?",
    answer:
      "Gömleğin hem erkek hem de kadınlar için uygun olup olmadığını veya belirli bir cinsiyete yönelik olup olmadığını belirtin.",
  },
  {
    question: "Kargo seçenekleri ve maliyetleri nelerdir?",
    answer:
      "Kargo yöntemleri, tahmini teslimat süreleri ve ilgili ücretler hakkında bilgi sağlayın.",
  },
  {
    question: "Tişört için iade politikası nedir?",
    answer:
      "Iade süresi, koşulları ve geri ödeme veya değişim prosedürlerini belirtin.",
  },
];

const FaqContent = () => {
  return (
    <section>
      <h3 className="text-xl sm:text-2xl font-bold text-black mb-5 sm:mb-6">
        Sıkça Sorulan Sorular
      </h3>
      <Accordion type="single" collapsible>
        {faqsData.map((faq, idx) => (
          <AccordionItem key={idx} value={`item-${idx + 1}`}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default FaqContent;
