import { site } from "@/config/site";
import { aboutEssay, aboutFaqs, creed } from "@/content/pages";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumb, faqPage } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: `진료철학 | ${site.representative} 대표원장`,
  description: `${site.name} ${site.representative} 대표원장의 진료철학 진심·소통·신뢰. 불편한 곳과 마음까지 잘 듣는 한의원이 되겠습니다.`,
  path: "/about/",
});

export default function About() {
  const crumbs: [string, string][] = [["홈", "/"], ["진료철학", "/about/"]];
  return (
    <>
      <JsonLd data={[breadcrumb(crumbs), faqPage(aboutFaqs)]} />
      <header className="page-hero">
        <div className="wrap narrow">
          <Breadcrumbs items={crumbs} />
          <h1>
            <span className="kicker">{site.name} 진료철학</span> 진심, 소통, 신뢰
          </h1>
          <p className="lead">
            {site.name}에 들어서면 복도에 이 세 단어가 적혀 있습니다. 한의사로 살아오며 마음속에서 다듬어진 진료철학입니다. — 대표원장 {site.representative}
          </p>
        </div>
      </header>
      <div className="wrap narrow article-body">
        <section className="qa">
          <h2>{site.name}의 진료철학은 무엇인가요?</h2>
          <p className="answer">진심, 소통, 신뢰입니다. 대표원장은 매일 아침 복도에 걸린 이 세 글귀를 보고 진료를 시작합니다.</p>
          <div className="creed">
            {creed.map((c) => (
              <figure key={c.word}>
                <img src={c.photo.src} width={c.photo.width} height={c.photo.height} loading="lazy" alt={c.photo.alt} />
                <figcaption>
                  <h3>
                    {c.word}({c.hanja})
                  </h3>
                  <p className="meaning">{c.meaning}</p>
                  <p>{c.text}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
        {aboutEssay.map((e) => (
          <section className="qa" key={e.heading}>
            <h2>{e.heading}</h2>
            {e.paragraphs.map((p, i) => (
              <p key={i} className={i === 0 ? "answer" : undefined}>
                {p}
              </p>
            ))}
          </section>
        ))}
        <p className="signature">
          {site.name} 대표원장 {site.representative}
          <img src="/img/signature.png" width={245} height={98} loading="lazy" alt={`${site.representative} 대표원장 친필 서명`} />
        </p>
        <FaqList topic="진료철학" faqs={aboutFaqs} />
      </div>
    </>
  );
}
