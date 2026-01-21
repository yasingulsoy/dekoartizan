"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { poppins } from "@/styles/fonts";
import * as motion from "framer-motion/client";
import { 
  Palette, 
  Ruler, 
  Package, 
  ThumbsUp 
} from "lucide-react";

type ProcessStep = {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
};

const processSteps: ProcessStep[] = [
  {
    id: 1,
    icon: <Palette className="w-8 h-8 md:w-10 md:h-10" strokeWidth={2} />,
    title: "1. DUVAR KAGIDI SECIN",
    description: "Benzersiz ve çeşitli duvar kağıtlarından sizin için en uygun olanı seçin.",
  },
  {
    id: 2,
    icon: <Ruler className="w-8 h-8 md:w-10 md:h-10" strokeWidth={2} />,
    title: "2. OLCUNUZU GIRIN",
    description: "Duvarınızın en ve boyutunu ölçtükten sonra siparişinizi oluşturun.",
  },
  {
    id: 3,
    icon: <Package className="w-8 h-8 md:w-10 md:h-10" strokeWidth={2} />,
    title: "3. BASKI VE KARGO",
    description: "Ürünler 1-3 iş günü içerisinde kargoya verilir.",
  },
  {
    id: 4,
    icon: <ThumbsUp className="w-8 h-8 md:w-10 md:h-10" strokeWidth={2} />,
    title: "4. KEYIFLE KULLANIN",
    description: "Gönderdiğimiz uygulama methodu ve tutkal yardımıyla duvarınıza uygulayın.",
  },
];

const ProcessSteps = () => {
  return (
    <section className="bg-white py-12 md:py-16 lg:py-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
        >
          {processSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative bg-[#060010] rounded-lg p-6 md:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* İkon Container */}
              <div className="mb-4 md:mb-6 flex items-center justify-center">
                <div className="bg-white/10 rounded-full p-4 md:p-5 group-hover:bg-white/20 transition-colors duration-300">
                  <div className="text-white">
                    {step.icon}
                  </div>
                </div>
              </div>
              
              {/* Başlık */}
              <h3
                className={cn([
                  poppins.className,
                  "text-base md:text-lg lg:text-xl font-bold text-white mb-3 md:mb-4",
                ])}
              >
                {step.title}
              </h3>
              
              {/* Açıklama */}
              <p className="text-sm md:text-base text-white/80 leading-relaxed">
                {step.description}
              </p>
              
              {/* Step Number Badge */}
              <div className="absolute top-4 right-4 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-white text-xs md:text-sm font-bold">{step.id}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessSteps;
