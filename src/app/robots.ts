import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export const dynamic = "force-static";

/** 검색엔진과 AI 크롤러 모두 수집 허용 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // AI 학습·답변용 크롤러를 이름으로 명시해 허용
        userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "CCBot"],
        allow: "/",
      },
      { userAgent: ["Googlebot", "Bingbot", "Yeti", "Daumoa"], allow: "/" },
      { userAgent: "*", allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
