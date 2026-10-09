import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import { treatments, treatmentBySlug } from "@/content/treatments";
import { posts } from "@/content/posts";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { QaSections } from "@/components/Content";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumb, faqPage, treatmentPage } from "@/lib/schema";
import { lastModified, koDate, SHARED_SOURCES } from "@/lib/lastmod";
import { pageMeta } from "@/lib/meta";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return treatments.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props) {
  const t = treatmentBySlug((await params).slug);
  if (!t) return {};
  return pageMeta({ title: t.title, description: t.description, path: `/treatments/${t.slug}/` });
}

export default async function TreatmentPage({ params }: Props) {
  const t = treatmentBySlug((await params).slug);
  if (!t) notFound();
  const modified = lastModified(t.source, ...SHARED_SOURCES);
  const crumbs: [string, string][] = [["홈", "/"], ["진료 안내", "/treatments/"], [t.name, `/treatments/${t.slug}/`]];
  const related = posts.filter((p) => p.relatedTreatment === t.slug);

  return (
    <article>
      <JsonLd data={[treatmentPage(t, modified), breadcrumb(crumbs), faqPage(t.faqs)]} />
      <header className="page-hero">
        <div className="wrap page-hero-grid">
          <div>
            <Breadcrumbs items={crumbs} />
            <h1>
              <span className="kicker">대구 성서 {site.name}</span> {t.name}
            </h1>
            <p className="lead">{t.lead}</p>
            <ul className="tags">
              {t.tags.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <p className="updated">
              최종 수정 <time dateTime={modified.toISOString()}>{koDate(modified)}</time>
            </p>
          </div>
          <figure className="page-photo">
            <img src={t.image.src} width={t.image.width} height={t.image.height} alt={t.image.alt} fetchPriority="high" />
          </figure>
        </div>
      </header>

      <div className="wrap narrow article-body">
        <QaSections sections={t.sections} />
        <FaqList topic={t.name} faqs={t.faqs} />
        <p className="disclaim">※ 치료 효과와 기간은 사람마다 다를 수 있습니다.</p>
      </div>

      <aside className="wrap narrow related" aria-label="관련 안내">
        {related.length > 0 && (
          <>
            <p className="related-title">관련 건강정보</p>
            <ul>
              {related.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}/`}>{p.title}</Link>
                </li>
              ))}
            </ul>
          </>
        )}
        <p className="related-title">다른 진료</p>
        <ul className="chip-list">
          {treatments
            .filter((x) => x.slug !== t.slug)
            .map((x) => (
              <li key={x.slug}>
                <Link href={`/treatments/${x.slug}/`}>{x.name}</Link>
              </li>
            ))}
        </ul>
      </aside>
    </article>
  );
}
