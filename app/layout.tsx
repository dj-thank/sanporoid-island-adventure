import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import PwaRegistration from "./PwaRegistration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);
  return {
  title: "欠けた潮星｜神津島・新島・式根島の三島冒険",
  description: "8月29日から9月1日。神津島、新島、式根島を写真ミッションとチェックポイントで巡る友達旅行。宿泊は神津島、新島、新島です。",
    metadataBase,
    openGraph: {
    title: "欠けた潮星｜神津島・新島・式根島の三島冒険",
    description: "神津島の導き、新島の反響、式根島の約束を、写真と会話で集める旅アプリ。",
      type: "website",
    },
    twitter: {
      card: "summary",
    title: "欠けた潮星｜神津島・新島・式根島の三島冒険",
    description: "チェックポイント、島の異変図鑑、島Q&Aを持って旅へ。",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <PwaRegistration />
        {children}
      </body>
    </html>
  );
}
