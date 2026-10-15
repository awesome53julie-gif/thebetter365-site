import type { Metadata, Viewport } from "next";
import { site } from "@/config/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyCta } from "@/components/StickyCta";
import { Analytics } from "@/components/Analytics";
import "./globals.css";

const v = site.verification;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
  icons: { icon: [{ url: "/favicon.ico", sizes: "48x48" }, { url: "/img/icon-192.png", sizes: "192x192", type: "image/png" }], apple: "/img/apple-touch-icon.png" },
  // 검색 등록 확인 태그 슬롯: src/config/site.ts 의 verification 값이 있을 때만 출력
  verification: {
    ...(v.google ? { google: v.google } : {}),
    other: {
      ...(v.bing ? { "msvalidate.01": v.bing } : {}),
      ...(v.naver ? { "naver-site-verification": v.naver } : {}),
    },
  },
};

export const viewport: Viewport = { themeColor: "#FFE001", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preload" href="/fonts/PretendardVariable.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body>
        <a className="skip" href="#main">
          본문 바로가기
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <StickyCta />
        <Analytics />
      </body>
    </html>
  );
}
