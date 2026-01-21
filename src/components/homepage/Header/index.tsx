import React from "react";
import FlowingMenu from "@/components/ui/FlowingMenu";

const demoItems = [
  {
    link: "/shop",
    text: "Yeni Gelenler İndirimde",
    subTexts: ["Özel Koleksiyonlar", "Kampanyalar"],
    image: "https://picsum.photos/600/400?random=1",
  },
  { link: "/shop#top-selling", text: "Çok Satanlar", image: "https://picsum.photos/600/400?random=2" },
  { link: "/shop", text: "Sezon Sonu Fırsatları", image: "https://picsum.photos/600/400?random=4" },
  { link: "/shop", text: "Yeni Sezon", image: "https://picsum.photos/600/400?random=6" },
];

const Header = () => {
  return (
    <header className="relative">
      <div className="h-[450px] md:h-[600px] lg:h-[675px] relative">
        <FlowingMenu
          items={demoItems}
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
