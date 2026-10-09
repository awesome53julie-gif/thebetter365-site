import { site, fullAddress, hoursText, abs } from "@/config/site";
import { treatments } from "@/content/treatments";
import { posts } from "@/content/posts";

export const dynamic = "force-static";

/** AI용 사이트 요약 (llms.txt) */
export function GET() {
  const lines = [
    `# ${site.name}`,
    "",
    `> ${fullAddress}(${site.address.neighborhood}, ${site.address.landmark})의 한의원. 한의사 ${site.doctorCount}명이 365일 점심시간 없이 진료한다. ${hoursText}. ${site.parking}. 전화 ${site.phone.display}.`,
    "",
    "## 병원 안내",
    `- [메인: 기본 정보·진료시간·오시는 길](${abs("/")})`,
    `- [의료진](${abs("/doctors/")})`,
    `- [진료철학](${abs("/about/")})`,
    `- [예약 신청](${abs("/reservation/")})`,
    "",
    "## 진료",
    ...treatments.map((t) => `- [${t.name}](${abs(`/treatments/${t.slug}/`)}): ${t.description}`),
    "",
    "## 건강정보",
    ...posts.map((p) => `- [${p.title}](${abs(`/blog/${p.slug}/`)}): ${p.description}`),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
