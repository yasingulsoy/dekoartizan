"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { poppins } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Step {
  id: number;
  title: string;
  description: string;
  image?: string;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Yüzey Hazırlığı",
    description:
      "Uygulama yapılacak yüzeyin spatula gibi bir malzeme ile pürüzlerden arındırılması, ufak taş parçalarının ve kararan yerlerin temizlenmesi gerekmektedir. Zeminin pürüzsüz olması çok önemlidir, aksi takdirde uygulama sırasında çizilmeler oluşabilir.",
  },
  {
    id: 2,
    title: "Ürün Kontrolü",
    description:
      "Ürünümüz tek parça tekstil duvar kağıdıdır ve bu sayede yırtılmama özelliğine sahiptir. Ürünü geniş bir alana sererek hangi tarafından yapıştıracağınızı kontrol edebilirsiniz.",
  },
  {
    id: 3,
    title: "Tutkal Hazırlığı (İlk Karıştırma)",
    description:
      "Paket içerisinden çıkan tutkalın üzerinde yazan miktar su ile karıştırılarak hazırlanmalıdır. Boş bir kovaya belli oranda su eklenip, toz tutkalın yavaş yavaş serpilerek jel kıvamına gelene kadar çubuk yardımıyla karıştırılmalıdır.",
  },
  {
    id: 4,
    title: "Tutkal Hazırlığı (Takviye Ekleme)",
    description:
      "Hazırlanan tutkala, ürünün duvarda daha sağlam durması için 50-100 ml kadar ahşap tutkalı (plastik tutkal, marangoz tutkalı veya beyaz tutkal olarak da bilinen) eklenmesi dayanıklılığı artıracaktır. Bu takviye katılmadan da uygulanabilir.",
  },
  {
    id: 5,
    title: "Duvara Tutkal Sürme",
    description:
      "Ürünümüz tek parça olduğu için ek yeri birleştirme veya desen tutturma gibi zorluklar yoktur. Tutkalın duvar boyama rulosu ile uygulama yapılacak duvara komple sürülmesi, kenar kısımların ise boyacı kestirme fırçası gibi bir fırça ile yapılması uygundur. Tutkalın değmeyen yer kalmamasına özen gösterilmelidir.",
  },
  {
    id: 6,
    title: "Duvar Kağıdını Duvara Yapıştırma",
    description:
      "Tutkal duvara sürüldükten sonra, duvar kağıdının sağ ve sol üst köşelerinden tutularak, üst kısımdan aşağıya doğru duvara hızlanarak, orta kısımdan kenarlara doğru taranarak yapıştırılmalıdır. Yamukluk olması durumunda sökülüp tekrar yapıştırılabilir. Hava kabarcıklarının spatula, ragle veya plastik cetvel gibi malzemelerle hafifçe taranarak dışarı atılması gerekmektedir.",
  },
  {
    id: 7,
    title: "Temizleme ve Kuruma",
    description:
      "Tutkalın ürünün ön yüzüne bulaşmamasına özen gösterilmelidir. Bulaşan tutkal olursa nemli bir bezle hafifçe temizlenebilir. Duvar kenarlarında fazlalık kalması durumunda maket bıçağı yardımıyla kesilebilir. Ürünün duvarda tamamen kuruması 1-2 gün sürebilir.",
  },
];

export default function TekstilDuvarKagidiUygulamaPage() {
  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Ana Sayfa</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Tekstil Duvar Kağıdı Uygulama Şeması</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="text-center mb-12">
          <h1
            className={cn([
              poppins.className,
              "font-bold text-3xl md:text-4xl lg:text-5xl text-black uppercase mb-4",
            ])}
          >
            Tekstil Duvar Kağıdı Uygulama Şeması
          </h1>
          <p className="text-black/70 text-base md:text-lg max-w-3xl mx-auto">
            Tekstil duvar kağıdınızı doğru şekilde uygulamak için aşağıdaki
            adımları takip edin.
          </p>
        </div>

        <div className="space-y-12 md:space-y-16">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start"
            >
              {/* Sol taraf - Görsel */}
              <div className="w-full lg:w-1/2 flex-shrink-0">
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  {/* Placeholder görsel - gerçek görseller eklendiğinde buraya Image component'i kullanılabilir */}
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                    <span className="text-gray-400 text-sm">
                      Adım {step.id} Görseli
                    </span>
                  </div>
                </div>
              </div>

              {/* Sağ taraf - İçerik */}
              <div className="w-full lg:w-1/2 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
                    {step.id}
                  </div>
                  <h2
                    className={cn([
                      poppins.className,
                      "font-bold text-2xl md:text-3xl text-black uppercase",
                    ])}
                  >
                    {step.title}
                  </h2>
                </div>
                <p className="text-black/80 text-base md:text-lg leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Önemli Notlar Bölümü */}
        <div className="mt-16 p-6 md:p-8 bg-black/5 rounded-2xl">
          <h3
            className={cn([
              poppins.className,
              "font-bold text-xl md:text-2xl text-black uppercase mb-4",
            ])}
          >
            Önemli Notlar
          </h3>
          <ul className="space-y-3 text-black/80">
            <li className="flex items-start gap-3">
              <span className="text-black font-bold mt-1">•</span>
              <span>
                Uygulama öncesi yüzeyin tamamen temiz ve pürüzsüz olduğundan
                emin olun.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-black font-bold mt-1">•</span>
              <span>
                Tutkal hazırlarken paket üzerindeki talimatları dikkatlice
                okuyun.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-black font-bold mt-1">•</span>
              <span>
                Hava kabarcıklarını çıkarmak için yumuşak bir spatula veya
                ragle kullanın.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-black font-bold mt-1">•</span>
              <span>
                Kuruma süresi boyunca ürünün üzerine baskı yapmayın veya
                temas etmeyin.
              </span>
            </li>
          </ul>
        </div>

        {/* Yardım Bölümü */}
        <div className="mt-12 text-center">
          <p className="text-black/70 text-base mb-4">
            Uygulama sırasında sorun yaşarsanız veya yardıma ihtiyacınız
            olursa bizimle iletişime geçebilirsiniz.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/905551234567"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors font-medium"
            >
              WhatsApp ile İletişim
            </a>
            <a
              href="mailto:info@dekoartizan.com"
              className="px-6 py-3 bg-black text-white rounded-full hover:bg-black/90 transition-colors font-medium"
            >
              E-posta Gönder
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
