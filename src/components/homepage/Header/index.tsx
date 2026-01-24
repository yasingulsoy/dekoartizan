'use client';

import React, { useEffect, useState } from "react";
import FlowingMenu from "@/components/ui/FlowingMenu";

const demoItems = [
  {
    link: "/shop",
    text: "",
    subTexts: [],
    image: "https://picsum.photos/600/400?random=1",
  },
  { 
    link: "/shop#top-selling", 
    text: "Çok Satanlar",
    image: "https://picsum.photos/600/400?random=2"
  },
  { link: "/shop", text: "Sezon Sonu Fırsatları", image: "https://picsum.photos/600/400?random=4" },
  { link: "/shop", 
    text: "Yeni Tasarımlar", 
    image: "https://picsum.photos/600/400?random=6"
  },
];

const Header = () => {
  const [slideImages, setSlideImages] = useState<string[]>([]);

  useEffect(() => {
    const loadSlideImages = async () => {
      try {
        const response = await fetch('/api/header-kare');
        const data = await response.json();
        if (data.success && data.images && data.images.length > 0) {
          setSlideImages(data.images);
        }
      } catch (error) {
        console.error('Slide resimleri yüklenemedi:', error);
      }
    };

    loadSlideImages();
  }, []);

  // İlk item'a slide resimlerini ekle
  const items = demoItems.map((item, idx) => {
    if (idx === 0 && slideImages.length > 0) {
      return {
        ...item,
        slideImages: slideImages,
        slideInterval: 4000, // 4 saniyede bir değişsin
      };
    }
    return item;
  });

  return (
    <header className="relative">
      <div className="h-[450px] md:h-[600px] lg:h-[675px] relative">
        <FlowingMenu
          items={items}
          layout="leftMerged3"
          speed={10}
          textColor="#ffffff"
          bgColor="#060010"
          marqueeBgColor="#ffffff"
          marqueeTextColor="#060010"
          borderColor="#ffffff"
        />
      </div>
    </header>
  );
};

export default Header;
