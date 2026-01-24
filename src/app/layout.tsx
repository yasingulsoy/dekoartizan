import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { satoshi } from "@/styles/fonts";
// import TopBanner from "@/components/layout/Banner/TopBanner";
import TopNavbar from "@/components/layout/Navbar/TopNavbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import HolyLoader from "holy-loader";
import Providers from "./providers";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
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
  const isProduction = process.env.NODE_ENV === "production";
  const port = process.env.PORT || process.env.NEXT_PUBLIC_PORT || "3000";
  const showComingSoon = isProduction && port === "3000";

  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={satoshi.className}>
        <HolyLoader color="#868686" />
        {showComingSoon ? (
          <ComingSoon />
        ) : (
          <>
            {/* <TopBanner /> */}
            <Providers>
              <TopNavbar />
              {children}
            </Providers>
            <Footer />
            <WhatsAppButton />
          </>
        )}
      </body>
    </html>
  );
}
