import { cn } from "@/lib/utils";
import { poppins } from "@/styles/fonts";
import React from "react";
import { PaymentBadge, SocialNetworks } from "./footer.types";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import Link from "next/link";
import LinksSection from "./LinksSection";
import Image from "next/image";
import NewsLetterSection from "./NewsLetterSection";
import LayoutSpacing from "./LayoutSpacing";

const socialsData: SocialNetworks[] = [
  {
    id: 1,
    icon: <FaTwitter />,
    url: "https://twitter.com",
  },
  {
    id: 2,
    icon: <FaFacebookF />,
    url: "https://facebook.com",
  },
  {
    id: 3,
    icon: <FaInstagram />,
    url: "https://instagram.com",
  },
];

const paymentBadgesData: PaymentBadge[] = [
  {
    id: 1,
    srcUrl: "/icons/Visa.svg",
  },
  {
    id: 2,
    srcUrl: "/icons/mastercard.svg",
  },
  {
    id: 3,
    srcUrl: "/icons/paypal.svg",
  },
  {
    id: 4,
    srcUrl: "/icons/applePay.svg",
  },
  {
    id: 5,
    srcUrl: "/icons/googlePay.svg",
  },
];

const Footer = () => {
  return (
    <footer className="mt-10">
      <div className="relative">
        <div className="absolute bottom-0 w-full h-1/2" style={{ background: 'linear-gradient(45deg, #8E6E1E 0%, #C5A028 40%, #D4AF37 85%, #FCE7A2 100%)' }}></div>
        <div className="px-4">
          <NewsLetterSection />
        </div>
      </div>
      <div className="pt-8 md:pt-[50px] bg-gradient-to-br from-gold-dark via-gold to-gold-light px-4 pb-4" style={{ background: 'linear-gradient(45deg, #8E6E1E 0%, #C5A028 40%, #D4AF37 85%, #FCE7A2 100%)' }}>
        <div className="max-w-frame mx-auto">
          <nav className="lg:grid lg:grid-cols-12 mb-8">
            <div className="flex flex-col lg:col-span-3 lg:max-w-[248px]">
              <Link
                href="/"
                className="flex items-center gap-2 mb-6"
              >
                <Image
                  src="/images/LOGO.svg"
                  alt="dekoartizan logo"
                  width={1000}
                  height={1000}
                  className="w-10 h-10 lg:w-[50px] lg:h-[50px]"
                />
                <h1
                  className={cn([
                    poppins.className,
                    "text-[28px] lg:text-[32px] text-white",
                  ])}
                >
                  dekoartizan
                </h1>
              </Link>
              <p className="text-white/90 text-sm mb-9">
                Evinize uygun ve dekorasyonunuzdan gurur duyacağınız duvar kağıtlarımız var.
                Her mekana uygun.
              </p>
              <div className="flex items-center">
                {socialsData.map((social) => (
                  <Link
                    href={social.url}
                    key={social.id}
                    className="bg-white/20 hover:bg-white/30 hover:text-white transition-all mr-3 w-7 h-7 rounded-full border border-white/30 flex items-center justify-center p-1.5 text-white"
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>
            <div className="hidden lg:grid col-span-9 lg:grid-cols-4 lg:pl-10">
              <LinksSection />
            </div>
            <div className="grid lg:hidden grid-cols-2 sm:grid-cols-4">
              <LinksSection />
            </div>
          </nav>

          <hr className="h-[1px] border-t-white/20 mb-6" />
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center mb-2">
          </div>
          
          {/* Footer Alt Linkler */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-xs md:text-sm text-white/80 mb-6 pb-6 border-b border-white/20">
            <Link href="/gizlilik-ve-guvenlik" className="hover:text-white transition-colors">
              GİZLİLİK VE GÜVENLİK
            </Link>
            <Link href="/iade-ve-degisim-bilgileri" className="hover:text-white transition-colors">
              İADE VE DEĞİŞİM BİLGİLERİ
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              KARGO BİLGİLERİ
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              KİŞİSEL VERİLERİN KORUNMASI
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              MESAFELİ SATIŞ SÖZLEŞMESİ
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              SIKÇA SORULAN SORULAR
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              UYGULAMA TALİMATLARI
            </Link>
          </div>
          
          <div className="flex justify-center items-center mt-6 mb-4">
            <Link
              href="https://www.trendyol.com/magaza/dekoartizan-wallpapers-m-198770?channelId=1&sst=0"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <span className="text-sm text-white/90">Trendyol'da bizi ziyaret edin:</span>
              <Image
                src="/images/trendyol.png"
                alt="Trendyol"
                width={100}
                height={30}
                className="h-6 w-auto"
              />
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 text-sm text-white/90 mt-4">
            <span>© {new Date().getFullYear()} dekoartizan</span>
            <span className="hidden sm:inline">•</span>
            <span>
              Geliştirici:{" "}
              <Link
                href="https://cengaversoft.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors font-medium"
              >
                cengaversoft.com
              </Link>
            </span>
            <span className="hidden sm:inline">•</span>
            <span>Yasin Gülsoy</span>
          </div>
        </div>
        <LayoutSpacing />
      </div>
    </footer>
  );
};

export default Footer;
