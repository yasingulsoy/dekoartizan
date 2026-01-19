import React from "react";
import { FooterLinks } from "./footer.types";
import Link from "next/link";
import { cn } from "@/lib/utils";

const footerLinksData: FooterLinks[] = [
  {
    id: 1,
    title: "şirket",
    children: [
      {
        id: 11,
        label: "hakkımızda",
        url: "#",
      },
      {
        id: 12,
        label: "özellikler",
        url: "#",
      },
      {
        id: 13,
        label: "çalışmalar",
        url: "#",
      },
      {
        id: 14,
        label: "kariyer",
        url: "#",
      },
    ],
  },
  {
    id: 2,
    title: "yardım",
    children: [
      {
        id: 21,
        label: "müşteri desteği",
        url: "#",
      },
      {
        id: 22,
        label: "teslimat detayları",
        url: "#",
      },
      {
        id: 23,
        label: "şartlar ve koşullar",
        url: "/kullanim-sartlari",
      },
      {
        id: 24,
        label: "gizlilik politikası",
        url: "/gizlilik-politikasi",
      },
    ],
  },
  {
    id: 3,
    title: "sss",
    children: [
      {
        id: 31,
        label: "hesap",
        url: "#",
      },
      {
        id: 32,
        label: "teslimatları yönet",
        url: "#",
      },
      {
        id: 33,
        label: "siparişler",
        url: "#",
      },
      {
        id: 34,
        label: "ödeme",
        url: "#",
      },
    ],
  },
  {
    id: 4,
    title: "kaynaklar",
    children: [
      {
        id: 41,
        label: "Ucretsiz E-Kitaplar",
        url: "#",
      },
      {
        id: 42,
        label: "geliştirme eğitimi",
        url: "#",
      },
      {
        id: 43,
        label: "Nasıl Yapılır - Blog",
        url: "#",
      },
      {
        id: 44,
        label: "youtube oynatma listesi",
        url: "#",
      },
    ],
  },
];

const LinksSection = () => {
  return (
    <>
      {footerLinksData.map((item) => (
        <section className="flex flex-col mt-5" key={item.id}>
          <h3 className="font-medium text-sm md:text-base uppercase tracking-widest mb-6 text-white">
            {item.title}
          </h3>
          {item.children.map((link) => (
            <Link
              href={link.url}
              key={link.id}
              className={cn([
                link.id !== 41 && link.id !== 43 && "capitalize",
                "text-white/80 hover:text-white text-sm md:text-base mb-4 w-fit transition-colors",
              ])}
            >
              {link.label}
            </Link>
          ))}
        </section>
      ))}
    </>
  );
};

export default LinksSection;
