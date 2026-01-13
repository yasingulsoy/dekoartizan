import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
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
        <div className="absolute bottom-0 w-full h-1/2 bg-[#F0F0F0]"></div>
        <div className="px-4">
          <NewsLetterSection />
        </div>
      </div>
      <div className="pt-8 md:pt-[50px] bg-[#F0F0F0] px-4 pb-4">
        <div className="max-w-frame mx-auto">
          <nav className="lg:grid lg:grid-cols-12 mb-8">
            <div className="flex flex-col lg:col-span-3 lg:max-w-[248px]">
              <Link
                href="/"
                className="flex items-center gap-2 mb-6"
              >
                <Image
                  src="/images/logo.jpeg"
                  alt="dekoartizan logo"
                  width={40}
                  height={40}
                  className="w-8 h-8 lg:w-10 lg:h-10"
                />
                <h1
                  className={cn([
                    integralCF.className,
                    "text-[28px] lg:text-[32px]",
                  ])}
                >
                  dekoartizan
                </h1>
              </Link>
              <p className="text-black/60 text-sm mb-9">
                Evinize uygun ve dekorasyonunuzdan gurur duyacağınız duvar kağıtlarımız var.
                Her mekana uygun.
              </p>
              <div className="flex items-center">
                {socialsData.map((social) => (
                  <Link
                    href={social.url}
                    key={social.id}
                    className="bg-white hover:bg-black hover:text-white transition-all mr-3 w-7 h-7 rounded-full border border-black/20 flex items-center justify-center p-1.5"
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

          <hr className="h-[1px] border-t-black/10 mb-6" />
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center mb-2">
          </div>
          <div className="flex justify-center items-center mt-6 mb-4">
            <Link
              href="https://www.trendyol.com/magaza/dekoartizan-wallpapers-m-198770?channelId=1&sst=0"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <span className="text-sm text-black/60">Trendyol'da bizi ziyaret edin:</span>
              <Image
                src="/images/trendyol.png"
                alt="Trendyol"
                width={100}
                height={30}
                className="h-6 w-auto"
              />
            </Link>
          </div>
        </div>
        <LayoutSpacing />
      </div>
    </footer>
  );
};

export default Footer;
