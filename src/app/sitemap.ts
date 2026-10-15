import type { MetadataRoute } from "next";
import { abs } from "@/config/site";
import { treatments } from "@/content/treatments";
import { posts } from "@/content/posts";
import { lastModified, SHARED_SOURCES } from "@/lib/lastmod";

export const dynamic = "force-static";

/** lastmod = 각 페이지를 만드는 원고·코드 파일의 마지막 커밋 날짜 */
export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, files: string[], priority: number): MetadataRoute.Sitemap[number] => ({
    url: abs(path),
    lastModified: lastModified(...files, ...SHARED_SOURCES),
    priority,
  });
  return [
    page("/", ["src/app/page.tsx", "src/content/pages.ts", "src/content/doctors.ts"], 1),
    page("/treatments/", ["src/app/treatments/page.tsx", "src/content/pages.ts", ...treatments.map((t) => t.source)], 0.8),
    ...treatments.map((t) => page(`/treatments/${t.slug}/`, [t.source, "src/app/treatments/[slug]/page.tsx"], 0.9)),
    page("/doctors/", ["src/app/doctors/page.tsx", "src/content/doctors.ts", "src/content/pages.ts"], 0.7),
    page("/about/", ["src/app/about/page.tsx", "src/content/pages.ts"], 0.6),
    page("/blog/", ["src/app/blog/page.tsx", "src/content/pages.ts", ...posts.map((p) => p.source)], 0.7),
    ...posts.map((p) => page(`/blog/${p.slug}/`, [p.source, "src/app/blog/[slug]/page.tsx"], 0.7)),
    page("/reservation/", ["src/app/reservation/page.tsx", "src/content/pages.ts"], 0.6),
  ];
}
