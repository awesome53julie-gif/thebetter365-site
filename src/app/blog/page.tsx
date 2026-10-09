import Link from "next/link";
import { site } from "@/config/site";
import { posts } from "@/content/posts";
import { blogFaqs } from "@/content/pages";
import { FaqList } from "@/components/FaqList";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumb, faqPage } from "@/lib/schema";
import { koDate } from "@/lib/lastmod";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "건강정보",
  description: `대구 달서구 성서 ${site.name} 건강정보. 교통사고 자동차보험 진료, 추나 건강보험, 진료시간 이용 안내 등 진료실에서 자주 받는 질문을 정리했습니다.`,
  path: "/blog/",
});

export default function BlogIndex() {
  const crumbs: [string, string][] = [["홈", "/"], ["건강정보", "/blog/"]];
  return (
    <>
      <JsonLd data={[breadcrumb(crumbs), faqPage(blogFaqs)]} />
      <header className="page-hero">
        <div className="wrap">
          <Breadcrumbs items={crumbs} />
          <h1>{site.name} 건강정보</h1>
          <p className="lead">진료실에서 자주 받는 질문을 글로 정리했습니다.</p>
        </div>
      </header>
      <div className="wrap section">
        <ul className="card-grid">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link className="card" href={`/blog/${p.slug}/`}>
                <span className="tag">{p.category}</span>
                <h2>{p.title}</h2>
                <p>{p.description}</p>
                <time dateTime={p.published}>{koDate(p.published)}</time>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="wrap narrow">
        <FaqList topic="건강정보" faqs={blogFaqs} />
      </div>
    </>
  );
}
