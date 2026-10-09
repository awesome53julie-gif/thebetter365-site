import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import { posts, postBySlug } from "@/content/posts";
import { treatmentBySlug } from "@/content/treatments";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { QaSections } from "@/components/Content";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { article, breadcrumb, faqPage } from "@/lib/schema";
import { lastModified, koDate, SHARED_SOURCES } from "@/lib/lastmod";
import { pageMeta } from "@/lib/meta";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const p = postBySlug((await params).slug);
  if (!p) return {};
  return pageMeta({ title: p.title, description: p.description, path: `/blog/${p.slug}/`, type: "article" });
}

export default async function PostPage({ params }: Props) {
  const p = postBySlug((await params).slug);
  if (!p) notFound();
  const modified = lastModified(p.source, ...SHARED_SOURCES);
  const crumbs: [string, string][] = [["홈", "/"], ["건강정보", "/blog/"], [p.title, `/blog/${p.slug}/`]];
  const related = p.relatedTreatment ? treatmentBySlug(p.relatedTreatment) : undefined;

  return (
    <article>
      <JsonLd data={[article(p, modified), breadcrumb(crumbs), faqPage(p.faqs)]} />
      <header className="page-hero">
        <div className="wrap narrow">
          <Breadcrumbs items={crumbs} />
          <p className="tag">{p.category}</p>
          <h1>{p.title}</h1>
          <p className="lead">{p.description}</p>
          <p className="updated">
            글 {p.author ?? site.name}
            {p.reviewedBy ? ` · 검수 ${p.reviewedBy}` : ""} · 게시 <time dateTime={p.published}>{koDate(p.published)}</time> · 최종 수정{" "}
            <time dateTime={modified.toISOString()}>{koDate(modified)}</time>
          </p>
        </div>
      </header>
      <div className="wrap narrow article-body">
        <QaSections sections={p.sections} />
        <FaqList topic={p.category} faqs={p.faqs} />
        <p className="disclaim">※ 이 글은 일반적인 건강 정보이며 진료를 대체하지 않습니다. 정확한 진단과 치료는 한의사와 상담하세요.</p>
      </div>
      {related && (
        <aside className="wrap narrow related" aria-label="관련 진료">
          <p className="related-title">관련 진료 안내</p>
          <p>
            <Link className="text-link" href={`/treatments/${related.slug}/`}>{related.name} 진료 안내 보기 →</Link>
          </p>
        </aside>
      )}
    </article>
  );
}
