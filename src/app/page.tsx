import ProductListSec from "@/components/common/ProductListSec";
import Brands from "@/components/homepage/Brands";
import DressStyle from "@/components/homepage/DressStyle";
import Header from "@/components/homepage/Header";
import Reviews from "@/components/homepage/Reviews";
import ProcessSteps from "@/components/homepage/ProcessSteps";
import CartSidebar from "@/components/cart-sidebar/CartSidebar";
import { Review } from "@/types/review.types";
import { getNewArrivals, getTopSelling } from "@/lib/products";

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

export default async function Home() {
  // API'den ürünleri çek
  const [newArrivalsData, topSellingData] = await Promise.all([
    getNewArrivals(),
    getTopSelling(),
  ]);

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
      <CartSidebar />
    </>
  );
}
