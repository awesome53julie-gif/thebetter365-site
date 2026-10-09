import { site, telHref } from "@/config/site";
import { reservationFaqs } from "@/content/pages";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqList } from "@/components/FaqList";
import { HoursTable } from "@/components/HoursTable";
import { JsonLd } from "@/components/JsonLd";
import { ReservationForm } from "@/components/ReservationForm";
import { breadcrumb, faqPage } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "예약 신청",
  description: `${site.name} 진료 예약. 이름과 연락처만 남기시면 연락드려 진료 시간을 확정합니다. 전화 예약 ${site.phone.display}.`,
  path: "/reservation/",
});

export default function Reservation() {
  const crumbs: [string, string][] = [["홈", "/"], ["예약 신청", "/reservation/"]];
  return (
    <>
      <JsonLd data={[breadcrumb(crumbs), faqPage(reservationFaqs)]} />
      <header className="page-hero">
        <div className="wrap narrow">
          <Breadcrumbs items={crumbs} />
          <h1>{site.name} 예약 신청</h1>
          <p className="lead">
            이름과 연락처만 남겨 주시면 연락드려 진료 시간을 확정합니다. 바로 예약하시려면 전화 <a href={telHref}>{site.phone.display}</a>로 연락 주세요.
          </p>
        </div>
      </header>
      <div className="wrap narrow reserve-grid">
        <section aria-labelledby="form-title">
          <h2 id="form-title">예약 신청서</h2>
          <ReservationForm />
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
