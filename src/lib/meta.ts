import type { Metadata } from "next";
import { site } from "@/config/site";

/** 페이지별 제목·설명·canonical·공유 미리보기 */
export function pageMeta(o: { title: string; description: string; path: string; noindex?: boolean; type?: "website" | "article" }): Metadata {
  const title = o.path === "/" ? o.title : `${o.title} - ${site.name}`;
  return {
    title,
    description: o.description,
    alternates: { canonical: o.path },
    robots: o.noindex ? { index: false, follow: true } : { index: true, follow: true, "max-image-preview": "large" },
    openGraph: {
      type: o.type ?? "website",
      locale: "ko_KR",
      siteName: site.name,
      url: o.path,
      title,
      description: o.description,
      images: [{ url: "/img/og-image.jpg", width: 1200, height: 630, alt: `${site.name} 한의사 7명 단체 사진과 병원 이름, 전화번호` }],
    },
    twitter: { card: "summary_large_image" },
  };
}
