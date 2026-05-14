import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const notoJP = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-jp",
  display: "swap",
  preload: false,
});

const SITE_NAME = "invest-assist";
const SITE_DESCRIPTION =
  "新NISAつみたて投資をやさしく可視化。月額・利回り・期間から将来資産をシミュレートし、迷わず最初の一歩を踏み出せます。";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | 投資初心者のためのNISA積立シミュレーター`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  applicationName: SITE_NAME,
  authors: [{ name: "invest-assist" }],
  keywords: [
    "新NISA",
    "つみたてNISA",
    "シミュレーター",
    "インデックス投資",
    "投資初心者",
    "S&P500",
    "オルカン",
  ],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "ja_JP",
    // title / description は metadata.title.default / description から継承される
    // /opengraph-image.tsx が自動で og:image を出力するため、明示指定は不要
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${inter.variable} ${notoJP.variable}`}>
      <body className="flex min-h-screen flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
