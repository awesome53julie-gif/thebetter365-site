import Link from "next/link";
import { site } from "@/config/site";
import { treatments } from "@/content/treatments";
import { treatmentsFaqs } from "@/content/pages";
import { FaqList } from "@/components/FaqList";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumb, faqPage } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "진료 안내 | 교통사고·통증·추나·다이어트·보약",
  description: `${site.name}의 진료 안내. 교통사고 후유증, 통증치료, 추나치료, 한방 다이어트, 면역력·보약 진료별 대상과 치료 방법, 보험 적용을 안내합니다.`,
  path: "/treatments/",
});

export default function TreatmentsIndex() {
  const crumbs: [string, string][] = [["홈", "/"], ["진료 안내", "/treatments/"]];
  return (
    <>
      <JsonLd data={[breadcrumb(crumbs), faqPage(treatmentsFaqs)]} />
      <header className="page-hero">
        <div className="wrap">
          <Breadcrumbs items={crumbs} />
          <h1>{site.name} 진료 안내</h1>
          <p className="lead">진료마다 대상, 치료 방법, 보험 적용, 자주 묻는 질문을 정리했습니다.</p>
        </div>
      </header>
      <div className="wrap section">
        <ul className="card-grid">
          {treatments.map((t) => (
            <li key={t.slug}>
              <Link className="card" href={`/treatments/${t.slug}/`}>
                <img src={t.icon.src} width={64} height={64} alt={t.icon.alt} />
                <h2>{t.name}</h2>
                <p>{t.lead}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="wrap narrow">
        <FaqList topic="진료 안내" faqs={treatmentsFaqs} />
      </div>
    </>
  );
}
