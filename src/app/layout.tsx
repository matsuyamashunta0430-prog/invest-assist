import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const notoJP = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-jp",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "invest-assist | 投資初心者のためのNISA積立シミュレーター",
    template: "%s | invest-assist",
  },
  description:
    "新NISAつみたて投資をやさしく可視化。月額・利回り・期間から将来資産をシミュレートし、迷わず最初の一歩を踏み出せます。",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${inter.variable} ${notoJP.variable}`}>
      <body>{children}</body>
    </html>
  );
}
