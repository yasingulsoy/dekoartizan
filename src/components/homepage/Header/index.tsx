import React from "react";
import FlowingMenu from "@/components/ui/FlowingMenu";

const demoItems = [
  { link: '/shop#new-arrivals', text: 'Yeni Gelenler İndirimde', image: 'https://picsum.photos/600/400?random=1' },
  { link: '/shop#top-selling', text: 'Çok Satanlar', image: 'https://picsum.photos/600/400?random=2' },
  { link: '/shop', text: 'Özel Koleksiyonlar', image: 'https://picsum.photos/600/400?random=3' },
  { link: '/shop', text: 'Sezon Sonu Fırsatları', image: 'https://picsum.photos/600/400?random=4' }
];

const Header = () => {
  return (
    <header className="relative">
      <div className="h-[300px] md:h-[400px] lg:h-[450px] relative">
        <FlowingMenu
          items={demoItems}
          speed={15}
          textColor="#ffffff"
          bgColor="#060010"
          marqueeBgColor="#060010"
          marqueeTextColor="#ffffff"
          borderColor="#ffffff"
        />
      </div>
    </header>
  );
};

export default Header;
