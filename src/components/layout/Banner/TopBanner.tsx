"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const TopBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-black text-white text-center py-2 px-2 sm:px-4 xl:px-0">
      <div className="relative max-w-frame mx-auto">
        <p className="text-xs sm:text-sm">
          Kayıt olun ve ilk siparişinizde %20 indirim kazanın.{" "}
          <Link href="/signup" className="underline font-medium">
            Hemen Kayıt Ol
          </Link>
        </p>
        <Button
          variant="ghost"
          className="hover:bg-transparent absolute right-0 top-1/2 -translate-y-1/2 w-fit h-fit p-1"
          size="icon"
          type="button"
          aria-label="banner'ı kapat"
          onClick={() => setIsVisible(false)}
        >
          <Image
            priority
            src="/icons/times.svg"
            height={13}
            width={13}
            alt="banner'ı kapat"
          />
        </Button>
      </div>
    </div>
  );
};

export default TopBanner;
