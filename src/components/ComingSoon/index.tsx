"use client";

import { cn } from "@/lib/utils";
import { poppins } from "@/styles/fonts";
import Image from "next/image";
import React from "react";
import * as motion from "framer-motion/client";

const ComingSoon = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F0F1] px-4">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex justify-center"
        >
          <Image
            src="/images/LOGO.svg"
            alt="dekoartizan logo"
            width={1000}
            height={1000}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full"
            priority
          />
        </motion.div>

        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className={cn([
            poppins.className,
            "text-4xl md:text-6xl lg:text-7xl mb-6 md:mb-8",
          ])}
        >
          Çok Yakında Sizlerleyiz
        </motion.h1>

        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-black/60 text-base md:text-lg lg:text-xl mb-8 md:mb-12 max-w-lg mx-auto"
        >
          dekoartizan olarak yeni deneyimimizi hazırlıyoruz. 
          En kısa sürede sizlerle buluşacağız!
        </motion.p>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4 md:gap-6"
        >
          <div className="bg-white/80 backdrop-blur-sm px-6 py-4 rounded-[40px] shadow-sm">
            <div className="text-2xl md:text-3xl font-bold mb-1">200+</div>
            <div className="text-sm md:text-base text-black/60">Farklı Tasarım</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm px-6 py-4 rounded-[40px] shadow-sm">
            <div className="text-2xl md:text-3xl font-bold mb-1">2000+</div>
            <div className="text-sm md:text-base text-black/60">Mutlu Müşteri</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm px-6 py-4 rounded-[40px] shadow-sm">
            <div className="text-2xl md:text-3xl font-bold mb-1">3000+</div>
            <div className="text-sm md:text-base text-black/60">Mutlu Duvarlar</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 md:mt-16"
        >
          <div className="inline-block bg-[#F0F0F0] px-8 py-6 rounded-[40px]">
            <p className={cn([
              poppins.className,
              "text-xl md:text-2xl text-black/80"
            ])}>
              dekoartizan
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ComingSoon;
