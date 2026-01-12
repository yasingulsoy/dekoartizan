"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
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
    icon: <Palette className="w-12 h-12 md:w-16 md:h-16" strokeWidth={1.5} />,
    title: "1. DUVAR KAGIDI SECIN",
    description: "Benzersiz ve çeşitli duvar kağıtlarından sizin için en uygun olanı seçin.",
  },
  {
    id: 2,
    icon: <Ruler className="w-12 h-12 md:w-16 md:h-16" strokeWidth={1.5} />,
    title: "2. OLCUNUZU GIRIN",
    description: "Duvarınızın en ve boyutunu ölçtükten sonra siparişinizi oluşturun.",
  },
  {
    id: 3,
    icon: <Package className="w-12 h-12 md:w-16 md:h-16" strokeWidth={1.5} />,
    title: "3. BASKI VE KARGO",
    description: "Urünler 1-3 iş günü içerisinde kargoya verilir.",
  },
  {
    id: 4,
    icon: <ThumbsUp className="w-12 h-12 md:w-16 md:h-16" strokeWidth={1.5} />,
    title: "4. KEYIFLE KULLANIN",
    description: "Gönderdiğimiz uygulama methodu ve tutkal yardımıyla duvarınıza uygulayın.",
  },
];

const ProcessSteps = () => {
  return (
    <section className="bg-[#F2F0F1] py-8 md:py-12 lg:py-16">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {processSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 md:mb-6 text-[#8B4513]">
                {step.icon}
              </div>
              <h3
                className={cn([
                  integralCF.className,
                  "text-lg md:text-xl lg:text-2xl font-bold text-[#FF6B35] mb-2 md:mb-3",
                ])}
                style={{
                  fontFamily: `${integralCF.style.fontFamily}, "Arial Unicode MS", Arial, Helvetica, sans-serif`,
                }}
              >
                {step.title}
              </h3>
              <p className="text-sm md:text-base text-black/70 max-w-[280px]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessSteps;
