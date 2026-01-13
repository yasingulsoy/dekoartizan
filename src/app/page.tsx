import ProductListSec from "@/components/common/ProductListSec";
import Brands from "@/components/homepage/Brands";
import DressStyle from "@/components/homepage/DressStyle";
import Header from "@/components/homepage/Header";
import Reviews from "@/components/homepage/Reviews";
import ProcessSteps from "@/components/homepage/ProcessSteps";
import { Product } from "@/types/product.types";
import { Review } from "@/types/review.types";

// Duvar kağıdı ürünleri - HTML dosyasından çıkarılan isimler
export const newArrivalsData: Product[] = [
  {
    id: 1,
    title: "dekoartizan Saksılı Tropikal Bitkiler Duvar Kağıdı",
    srcUrl: "/images/1_org_zoom.jpg",
    gallery: ["/images/1_org_zoom.jpg"],
    price: 550,
    discount: {
      amount: 0,
      percentage: 5,
    },
    rating: 4.5,
  },
  {
    id: 2,
    title: "dekoartizan Tropikal Orman Duvar Kağıdı",
    srcUrl: "/images/1_org_zoom(1).jpg",
    gallery: ["/images/1_org_zoom(1).jpg"],
    price: 600,
    discount: {
      amount: 0,
      percentage: 10,
    },
    rating: 4.8,
  },
  {
    id: 3,
    title: "dekoartizan Doğa Manzarası Duvar Kağıdı",
    srcUrl: "/images/1_org_zoom(2).jpg",
    gallery: ["/images/1_org_zoom(2).jpg"],
    price: 520,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.3,
  },
  {
    id: 4,
    title: "dekoartizan Modern Botanik Duvar Kağıdı",
    srcUrl: "/images/1_org_zoom(3).jpg",
    gallery: ["/images/1_org_zoom(3).jpg"],
    price: 580,
    discount: {
      amount: 0,
      percentage: 15,
    },
    rating: 4.7,
  },
];

export const topSellingData: Product[] = [
  {
    id: 5,
    title: "dekoartizan Çiçekli Desen Duvar Kağıdı",
    srcUrl: "/images/1_org_zoom(4).jpg",
    gallery: ["/images/1_org_zoom(4).jpg"],
    price: 480,
    discount: {
      amount: 0,
      percentage: 8,
    },
    rating: 4.6,
  },
  {
    id: 6,
    title: "dekoartizan Geometrik Desen Duvar Kağıdı",
    srcUrl: "/images/1_org_zoom(5).jpg",
    gallery: ["/images/1_org_zoom(5).jpg"],
    price: 450,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.4,
  },
  {
    id: 7,
    title: "dekoartizan Soyut Desen Duvar Kağıdı",
    srcUrl: "/images/1_org_zoom(6).jpg",
    gallery: ["/images/1_org_zoom(6).jpg"],
    price: 500,
    discount: {
      amount: 0,
      percentage: 12,
    },
    rating: 4.5,
  },
  {
    id: 8,
    title: "dekoartizan Çizgili Desen Duvar Kağıdı",
    srcUrl: "/images/1_org_zoom(7).jpg",
    gallery: ["/images/1_org_zoom(7).jpg"],
    price: 420,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.2,
  },
];

export const relatedProductData: Product[] = [
  {
    id: 9,
    title: "dekoartizan Noktalı Desen Duvar Kağıdı",
    srcUrl: "/images/1_org_zoom(8).jpg",
    gallery: ["/images/1_org_zoom(8).jpg"],
    price: 460,
    discount: {
      amount: 0,
      percentage: 5,
    },
    rating: 4.3,
  },
  {
    id: 10,
    title: "dekoartizan Düz Renk Duvar Kağıdı",
    srcUrl: "/images/1_org_zoom(9).jpg",
    gallery: ["/images/1_org_zoom(9).jpg"],
    price: 380,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.1,
  },
  {
    id: 11,
    title: "dekoartizan Oturma Odası Duvar Kağıdı",
    srcUrl: "/images/1_org_zoom(10).jpg",
    gallery: ["/images/1_org_zoom(10).jpg"],
    price: 620,
    discount: {
      amount: 0,
      percentage: 10,
    },
    rating: 4.8,
  },
  {
    id: 12,
    title: "dekoartizan Yatak Odası Duvar Kağıdı",
    srcUrl: "/images/1_org_zoom(11).jpg",
    gallery: ["/images/1_org_zoom(11).jpg"],
    price: 590,
    discount: {
      amount: 0,
      percentage: 8,
    },
    rating: 4.6,
  },
  {
    id: 13,
    title: "dekoartizan Çocuk Odası Duvar Kağıdı",
    srcUrl: "/images/1_org_zoom(12).jpg",
    gallery: ["/images/1_org_zoom(12).jpg"],
    price: 540,
    discount: {
      amount: 0,
      percentage: 15,
    },
    rating: 4.7,
  },
  {
    id: 14,
    title: "dekoartizan Mutfak Duvar Kağıdı",
    srcUrl: "/images/1_org_zoom(13).jpg",
    gallery: ["/images/1_org_zoom(13).jpg"],
    price: 480,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.4,
  },
  {
    id: 15,
    title: "dekoartizan Banyo Duvar Kağıdı",
    srcUrl: "/images/1_org_zoom(14).jpg",
    gallery: ["/images/1_org_zoom(14).jpg"],
    price: 440,
    discount: {
      amount: 0,
      percentage: 5,
    },
    rating: 4.3,
  },
  {
    id: 16,
    title: "dekoartizan Ofis Duvar Kağıdı",
    srcUrl: "/images/1_org_zoom(15).jpg",
    gallery: ["/images/1_org_zoom(15).jpg"],
    price: 560,
    discount: {
      amount: 0,
      percentage: 12,
    },
    rating: 4.5,
  },
  {
    id: 17,
    title: "dekoartizan Koridor Duvar Kağıdı",
    srcUrl: "/images/1_org_zoom(16).jpg",
    gallery: ["/images/1_org_zoom(16).jpg"],
    price: 400,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.2,
  },
  {
    id: 18,
    title: "dekoartizan Premium Duvar Kağıdı",
    srcUrl: "/images/1_org_zoom(17).jpg",
    gallery: ["/images/1_org_zoom(17).jpg"],
    price: 680,
    discount: {
      amount: 0,
      percentage: 20,
    },
    rating: 4.9,
  },
  {
    id: 19,
    title: "dekoartizan Lüks Duvar Kağıdı",
    srcUrl: "/images/1_org_zoom(18).jpg",
    gallery: ["/images/1_org_zoom(18).jpg"],
    price: 720,
    discount: {
      amount: 0,
      percentage: 15,
    },
    rating: 4.8,
  },
  {
    id: 20,
    title: "dekoartizan Klasik Duvar Kağıdı",
    srcUrl: "/images/1_org_zoom(19).jpg",
    gallery: ["/images/1_org_zoom(19).jpg"],
    price: 500,
    discount: {
      amount: 0,
      percentage: 10,
    },
    rating: 4.5,
  },
  {
    id: 21,
    title: "dekoartizan Modern Duvar Kağıdı",
    srcUrl: "/images/1_org_zoom(20).jpg",
    gallery: ["/images/1_org_zoom(20).jpg"],
    price: 550,
    discount: {
      amount: 0,
      percentage: 8,
    },
    rating: 4.6,
  },
];

export const reviewsData: Review[] = [
  {
    id: 1,
    user: "Alex K.",
    content:
      '"Evimin dekorasyonuna uygun duvar kağıdı bulmak eskiden zordu, ta ki dekoartizan\'ı keşfedene kadar. Sundukları seçenek yelpazesi gerçekten dikkat çekici, çeşitli zevklere ve mekanlara hitap ediyor."',
    rating: 5,
    date: "14 Ağustos 2023",
  },
  {
    id: 2,
    user: "Sarah M.",
    content: `"dekoartizan'dan aldığım duvar kağıtlarının kalitesi ve tasarımından çok etkilendim. Oturma odasından yatak odasına kadar, satın aldığım her parça beklentilerimi aştı."`,
    rating: 5,
    date: "15 Ağustos 2023",
  },
  {
    id: 3,
    user: "Ethan R.",
    content: `"Bu duvar kağıdı, iyi tasarımı takdir eden herkes için olmazsa olmaz. Minimalist ama şık desen dikkatimi çekti ve uygulaması mükemmel. Bu duvar kağıdının her detayında tasarımcının dokunuşunu görebiliyorum."`,
    rating: 5,
    date: "16 Ağustos 2023",
  },
  {
    id: 4,
    user: "Olivia P.",
    content: `"Bir iç mimar olarak, sadelik ve işlevselliği değerli buluyorum. Bu duvar kağıdı sadece bu ilkeleri temsil etmekle kalmıyor, aynı zamanda mekanıma harika bir hava katıyor. Tasarımcının bu ürünü öne çıkarmak için yaratıcılığını ortaya koyduğu açık."`,
    rating: 5,
    date: "17 Ağustos 2023",
  },
  {
    id: 5,
    user: "Liam K.",
    content: `"Bu duvar kağıdı konfor ve yaratıcılığın birleşimi. Kalite mükemmel ve tasarım tasarımcının becerisini gösteriyor. Hem tasarım hem de dekorasyona olan tutkumu yansıtan bir sanat eseri gibi."`,
    rating: 5,
    date: "18 Ağustos 2023",
  },
  {
    id: 6,
    user: "Samantha D.",
    content: `"Bu duvar kağıdını kesinlikle çok seviyorum! Tasarım benzersiz ve kalite çok iyi. Bir dekoratör olarak, detaylara gösterilen özeni takdir ediyorum. En sevdiğim duvar kağıdım oldu."`,
    rating: 5,
    date: "19 Ağustos 2023",
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <ProcessSteps />
      <Brands />
      <main className="my-[50px] sm:my-[72px]">
        <ProductListSec
          title="YENİ GELENLER"
          data={newArrivalsData}
          viewAllLink="/shop#new-arrivals"
        />
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <hr className="h-[1px] border-t-black/10 my-10 sm:my-16" />
        </div>
        <div className="mb-[50px] sm:mb-20">
          <ProductListSec
            title="Çok Satanlar"
            data={topSellingData}
            viewAllLink="/shop#top-selling"
          />
        </div>
        <div className="mb-[50px] sm:mb-20">
          <DressStyle />
        </div>
        <Reviews data={reviewsData} />
      </main>
    </>
  );
}
