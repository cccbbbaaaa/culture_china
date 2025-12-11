import type { Metadata } from "next";
import { Inter, Noto_Sans_SC, Noto_Serif_SC, Playfair_Display } from "next/font/google";

import "@/app/globals.css";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";

// 标题字体 - 思源宋体 / Playfair Display
// Heading fonts - Noto Serif SC / Playfair Display
const notoSerif = Noto_Serif_SC({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const playfair = Playfair_Display({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

// 正文字体 - 思源黑体 / Inter
// Body fonts - Noto Sans SC / Inter
const notoSans = Noto_Sans_SC({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const inter = Inter({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "浙江大学晨兴文化中国人才计划",
  description: "Zhejiang University Morningside Cultural China Scholars Program",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${notoSerif.variable} ${playfair.variable} ${notoSans.variable} ${inter.variable}`}
    >
      <body className="bg-canvas font-sans text-ink antialiased">
        <Header />
        <main className="min-h-screen pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}


