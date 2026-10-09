import { site, telHref } from "@/config/site";
import { reservationFaqs } from "@/content/pages";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqList } from "@/components/FaqList";
import { HoursTable } from "@/components/HoursTable";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumb, faqPage } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "예약 안내",
  description: `${site.name} 진료 예약 안내. 네이버 예약에서 날짜와 시간을 골라 신청하거나 전화 ${site.phone.display}로 예약하세요.`,
  path: "/reservation/",
});

export default function Reservation() {
  const crumbs: [string, string][] = [["홈", "/"], ["예약 안내", "/reservation/"]];
  return (
    <>
      <JsonLd data={[breadcrumb(crumbs), faqPage(reservationFaqs)]} />
      <header className="page-hero">
        <div className="wrap narrow">
          <Breadcrumbs items={crumbs} />
          <h1>{site.name} 예약 안내</h1>
          <p className="lead">네이버 예약에서 원하는 날짜와 시간을 골라 신청하시거나, 전화로 예약하실 수 있습니다.</p>
        </div>
      </header>
      <div className="wrap narrow reserve-grid">
        <section aria-labelledby="how-title">
          <h2 id="how-title">어떻게 예약하나요?</h2>
          <div className="reserve-options">
            <a className="reserve-option primary" href={site.booking.naver} target="_blank" rel="noopener">
              <b>네이버 예약</b>
              <span>날짜와 시간을 직접 골라 신청 (새 창)</span>
            </a>
            <a className="reserve-option" href={telHref}>
              <b>전화 예약 {site.phone.display}</b>
              <span>진료시간 중 바로 예약·문의</span>
            </a>
          </div>
          <p className="form-note">교통사고 진료라면 접수할 때 보험사 이름과 사고 접수번호를 알려주세요.</p>
        </section>
        <section aria-labelledby="hours-title">
          <h2 id="hours-title">진료시간</h2>
          <HoursTable />
        </section>
      </div>
      <div className="wrap narrow">
        <FaqList topic="예약" faqs={reservationFaqs} />
      </div>
    </>
  );
}
