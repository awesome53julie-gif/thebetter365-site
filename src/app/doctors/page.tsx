import { site } from "@/config/site";
import { doctors } from "@/content/doctors";
import { doctorsFaqs } from "@/content/pages";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumb, faqPage, physicians } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "의료진",
  description: `${site.name} 의료진. ${site.representative} 대표원장을 비롯한 한의사 ${site.doctorCount}명이 요일·시간대별로 나누어 365일 진료합니다.`,
  path: "/doctors/",
});

export default function Doctors() {
  const crumbs: [string, string][] = [["홈", "/"], ["의료진", "/doctors/"]];
  return (
    <>
      <JsonLd data={[...physicians(), breadcrumb(crumbs), faqPage(doctorsFaqs)]} />
      <header className="page-hero">
        <div className="wrap">
          <Breadcrumbs items={crumbs} />
          <h1>{site.name} 의료진</h1>
          <p className="lead">
            {site.representative} 대표원장을 비롯한 한의사 {site.doctorCount}명이 요일·시간대별로 나누어 진료합니다. 그래서 평일 저녁과 주말에도 진료를 이어갑니다.
          </p>
        </div>
      </header>
      <div className="wrap section">
        <figure className="team-photo">
          <img src="/img/team-yellow.jpg" width={1170} height={420} alt={`노란 배경 앞에 흰 가운을 입고 나란히 선 ${site.name} 한의사 7명 단체 사진`} />
        </figure>
        <h2>한의사 소개</h2>
        <ul className="doc-grid">
          {doctors.map((d) => (
            <li key={d.photo.src} id={d.id ?? undefined}>
              <img src={d.photo.src} width={d.photo.width} height={d.photo.height} loading="lazy" alt={d.photo.alt} />
              <h3>
                {d.name ?? "한의사"} <small>{d.name ? d.role : ""}</small>
              </h3>
            </li>
          ))}
        </ul>
      </div>
      <div className="wrap narrow">
        <FaqList topic={`${site.name} 의료진`} faqs={doctorsFaqs} />
      </div>
    </>
  );
}
