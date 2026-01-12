import ProductListSec from "@/components/common/ProductListSec";
import Brands from "@/components/homepage/Brands";
import DressStyle from "@/components/homepage/DressStyle";
import Header from "@/components/homepage/Header";
import Reviews from "@/components/homepage/Reviews";
import ProcessSteps from "@/components/homepage/ProcessSteps";
import { Product } from "@/types/product.types";
import { Review } from "@/types/review.types";

export const newArrivalsData: Product[] = [
  {
    id: 1,
    title: "Bant Detaylı Tişört",
    srcUrl: "/images/pic1.png",
    gallery: ["/images/pic1.png", "/images/pic10.png", "/images/pic11.png"],
    price: 120,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.5,
  },
  {
    id: 2,
    title: "Dar Kesim Kot Pantolon",
    srcUrl: "/images/pic2.png",
    gallery: ["/images/pic2.png"],
    price: 260,
    discount: {
      amount: 0,
      percentage: 20,
    },
    rating: 3.5,
  },
  {
    id: 3,
    title: "Ekose Gömlek",
    srcUrl: "/images/pic3.png",
    gallery: ["/images/pic3.png"],
    price: 180,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.5,
  },
  {
    id: 4,
    title: "Kollu Cizgili Tişört",
    srcUrl: "/images/pic4.png",
    gallery: ["/images/pic4.png", "/images/pic10.png", "/images/pic11.png"],
    price: 160,
    discount: {
      amount: 0,
      percentage: 30,
    },
    rating: 4.5,
  },
];

export const topSellingData: Product[] = [
  {
    id: 5,
    title: "Dikey Cizgili Gömlek",
    srcUrl: "/images/pic5.png",
    gallery: ["/images/pic5.png", "/images/pic10.png", "/images/pic11.png"],
    price: 232,
    discount: {
      amount: 0,
      percentage: 20,
    },
    rating: 5.0,
  },
  {
    id: 6,
    title: "Cesaret Grafikli Tişört",
    srcUrl: "/images/pic6.png",
    gallery: ["/images/pic6.png", "/images/pic10.png", "/images/pic11.png"],
    price: 145,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.0,
  },
  {
    id: 7,
    title: "Bermuda Şort",
    srcUrl: "/images/pic7.png",
    gallery: ["/images/pic7.png"],
    price: 80,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 3.0,
  },
  {
    id: 8,
    title: "Yıpranmış Dar Kot Pantolon",
    srcUrl: "/images/pic8.png",
    gallery: ["/images/pic8.png"],
    price: 210,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.5,
  },
];

export const relatedProductData: Product[] = [
  {
    id: 12,
    title: "Kontrast Kenarlıklı Polo",
    srcUrl: "/images/pic12.png",
    gallery: ["/images/pic12.png", "/images/pic10.png", "/images/pic11.png"],
    price: 242,
    discount: {
      amount: 0,
      percentage: 20,
    },
    rating: 4.0,
  },
  {
    id: 13,
    title: "Gradyan Grafikli Tişört",
    srcUrl: "/images/pic13.png",
    gallery: ["/images/pic13.png", "/images/pic10.png", "/images/pic11.png"],
    price: 145,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 3.5,
  },
  {
    id: 14,
    title: "Uç Detaylı Polo",
    srcUrl: "/images/pic14.png",
    gallery: ["/images/pic14.png"],
    price: 180,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.5,
  },
  {
    id: 15,
    title: "Siyah Cizgili Tişört",
    srcUrl: "/images/pic15.png",
    gallery: ["/images/pic15.png"],
    price: 150,
    discount: {
      amount: 0,
      percentage: 30,
    },
    rating: 5.0,
  },
];

export const reviewsData: Review[] = [
  {
    id: 1,
    user: "Alex K.",
    content:
      '"Kişisel tarzıma uygun kıyafetler bulmak eskiden zordu, ta ki dekoartizan\'ı keşfedene kadar. Sundukları seçenek yelpazesi gerçekten dikkat çekici, çeşitli zevklere ve durumlara hitap ediyor."',
    rating: 5,
    date: "14 Ağustos 2023",
  },
  {
    id: 2,
    user: "Sarah M.",
    content: `"dekoartizan'dan aldığım kıyafetlerin kalitesi ve tarzından çok etkilendim. Günlük giyimden zarif elbiselere kadar, satın aldığım her parça beklentilerimi aştı."`,
    rating: 5,
    date: "15 Ağustos 2023",
  },
  {
    id: 3,
    user: "Ethan R.",
    content: `"Bu tişört, iyi tasarımı takdir eden herkes için olmazsa olmaz. Minimalist ama şık desen dikkatimi çekti ve kesimi mükemmel. Bu gömleğin her yönünde tasarımcının dokunuşunu görebiliyorum."`,
    rating: 5,
    date: "16 Ağustos 2023",
  },
  {
    id: 4,
    user: "Olivia P.",
    content: `"Bir UI/UX tutkunu olarak, sadelik ve işlevselliği değerli buluyorum. Bu tişört sadece bu ilkeleri temsil etmekle kalmıyor, aynı zamanda giymesi de harika. Tasarımcının bu tişörtü öne çıkarmak için yaratıcılığını ortaya koyduğu açık."`,
    rating: 5,
    date: "17 Ağustos 2023",
  },
  {
    id: 5,
    user: "Liam K.",
    content: `"Bu tişört konfor ve yaratıcılığın birleşimi. Kumaş yumuşak ve tasarım tasarımcının becerisini gösteriyor. Hem tasarım hem de modaya olan tutkumu yansıtan bir sanat eseri giymek gibi."`,
    rating: 5,
    date: "18 Ağustos 2023",
  },
  {
    id: 6,
    user: "Samantha D.",
    content: `"Bu tişörtü kesinlikle çok seviyorum! Tasarım benzersiz ve kumaş çok rahat. Bir tasarımcı olarak, detaylara gösterilen özeni takdir ediyorum. En sevdiğim günlük tişörtüm oldu."`,
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
          title="YENI GELENLER"
          data={newArrivalsData}
          viewAllLink="/shop#new-arrivals"
        />
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <hr className="h-[1px] border-t-black/10 my-10 sm:my-16" />
        </div>
        <div className="mb-[50px] sm:mb-20">
          <ProductListSec
            title="Cok Satanlar"
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
