import localFont from "next/font/local";
import { Poppins } from "next/font/google";

const integralCF = localFont({
  src: [
    {
      path: "./integralcf-bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  fallback: ["Arial Unicode MS", "Arial", "Helvetica", "sans-serif"],
  variable: "--font-integralCF",
  display: "swap",
  preload: true,
});

const satoshi = localFont({
  src: [
    {
      path: "./Satoshi-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Satoshi-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./Satoshi-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  fallback: ["Arial", "Helvetica", "sans-serif"],
  variable: "--font-satoshi",
  display: "swap",
  preload: true,
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

export { integralCF, satoshi, poppins };
