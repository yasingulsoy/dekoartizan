import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@/styles/globals.css";
import { satoshi } from "@/styles/fonts";
import ComingSoon from "@/components/ComingSoon";
import HolyLoader from "holy-loader";

export const metadata: Metadata = {
  title: "dekoartizan - Yakında Açılıyoruz",
  description: "dekoartizan olarak yeni deneyimimizi hazırlıyoruz. En kısa sürede sizlerle buluşacağız!",
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
        <ComingSoon />
      </body>
    </html>
  );
}
