import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "leaflet/dist/leaflet.css";
import "./globals.css";

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
  title: "一緒に島へ行こう｜3泊4日のテント旅に、あと1〜2人",
  description: "8月29日から9月1日。三晩すべて指定キャンプ場で眠り、島ごとに車を借りる友達旅行。決まったことも未確定なことも正直に伝える参加案内です。",
    metadataBase,
    openGraph: {
    title: "一緒に島へ行こう｜3泊4日のテント旅に、あと1〜2人",
    description: "3泊テント＋島ごとのレンタカー。予約前の今から一緒に旅をつくる友達を迎えるページです。",
      type: "website",
    },
    twitter: {
      card: "summary",
    title: "一緒に島へ行こう｜3泊4日のテント旅に、あと1〜2人",
    description: "決まったことも、まだ決まっていないことも正直に。友達との島旅の参加案内です。",
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
        {children}
      </body>
    </html>
  );
}
