import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@/styles/globals.css";
import { satoshi } from "@/styles/fonts";
import ComingSoon from "@/components/ComingSoon";
import TopNavbar from "@/components/layout/Navbar/TopNavbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import Chatbot from "@/components/chatbot/Chatbot";
import HolyLoader from "holy-loader";
import Providers from "./providers";

const isProduction = process.env.NODE_ENV === "production";

export const metadata: Metadata = isProduction
  ? {
      title: "dekoartizan - Yakında Açılıyoruz",
      description: "dekoartizan olarak yeni deneyimimizi hazırlıyoruz. En kısa sürede sizlerle buluşacağız!",
    }
  : {
      title: "dekoartizan - Duvar Kağıdı",
      description: "Benzersiz ve çeşitli duvar kağıtlarından sizin için en uygun olanı seçin. Olçünüzü girin, sipariş verin ve keyifle kullanın.",
    };

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={satoshi.className}>
        {/* Google tag (gtag.js) - head içine eklenecek */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0BC4SHGERP"
          strategy="beforeInteractive"
        />
        <Script id="google-analytics" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0BC4SHGERP');
          `}
        </Script>
        <HolyLoader color="#868686" />
        {isProduction ? (
          <ComingSoon />
        ) : (
          <>
            <Providers>
              <TopNavbar />
              {children}
            </Providers>
            <Footer />
            <WhatsAppButton />
            <Chatbot />
          </>
        )}
      </body>
    </html>
  );
}
