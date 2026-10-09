import Link from "next/link";
import { site, fullAddress, telHref } from "@/config/site";
import { treatments } from "@/content/treatments";
import { doctors } from "@/content/doctors";
import { posts } from "@/content/posts";
import { homeFaqs } from "@/content/pages";
import { FaqList } from "@/components/FaqList";
import { HoursTable } from "@/components/HoursTable";
import { JsonLd } from "@/components/JsonLd";
import { clinic, faqPage, physicians, website } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: `성서 한의원 ${site.name} | 대구 달서구 이곡동 일요일·야간 진료`,
  description: `대구 달서구 성서 이곡동 ${site.name}. 한의사 ${site.doctorCount}명, 365일 점심시간 없이 진료(평일 ${site.hours[0].closes}까지, 토·일·공휴일 ${site.hours[1].closes}까지). 교통사고 후유증·통증·추나·다이어트·보약. ${site.parking}. ☎ ${site.phone.display}`,
  path: "/",
});

export default function Home() {
  const [weekday, weekend] = site.hours;
  return (
    <>
      <JsonLd data={[clinic(), ...physicians(), website(), faqPage(homeFaqs)]} />

      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <p className="kicker">
              대구 {site.address.locality} {site.address.neighborhood} · {site.address.landmark}
            </p>
            <h1>
              {site.address.neighborhood} 한의원 <span className="hl">{site.name}</span>
            </h1>
            <p className="hero-sub">
              한의사 {site.doctorCount}명이 365일 점심시간 없이 진료합니다. 평일은 저녁 {Number(weekday.closes.slice(0, 2)) - 12}시, 토·일·공휴일은 오후 {Number(weekend.closes.slice(0, 2)) - 12}시까지.
            </p>
            <div className="hero-cta">
              <Link className="btn primary" href="/reservation/">
                예약 신청
              </Link>
              <a className="btn ghost" href={telHref}>
                전화 {site.phone.display}
              </a>
            </div>
          </div>
          <figure className="hero-photo">
            <img
              src="/img/team-hero.jpg"
              width={710}
              height={570}
              fetchPriority="high"
              alt={`흰 가운을 입은 ${site.name} 한의사 7명이 팔짱을 끼거나 웃으며 함께 서 있는 단체 사진`}
            />
          </figure>
        </div>
      </section>

      <section className="section" aria-labelledby="summary-title">
        <div className="wrap narrow">
          <h2 id="summary-title">{site.name}은 어떤 한의원인가요?</h2>
          <p className="answer">
            {site.name}은 {fullAddress}({site.address.neighborhood}, {site.address.landmark})에 있는 한의원입니다. 한의사 {site.doctorCount}명이 365일 점심시간 없이 진료하며, 교통사고 후유증·통증·추나·다이어트·보약을 진료합니다.
          </p>
          <div className="table-wrap">
            <table className="info-table">
              <caption>{site.name} 기본 정보</caption>
              <tbody>
                <tr><th scope="row">주소</th><td>{fullAddress} ({site.address.landmark})</td></tr>
                <tr><th scope="row">전화</th><td><a href={telHref}>{site.phone.display}</a></td></tr>
                <tr><th scope="row">평일</th><td>{weekday.days} {weekday.opens} – {weekday.closes} ({weekday.note})</td></tr>
                <tr><th scope="row">주말·공휴일</th><td>{weekend.days} {weekend.opens} – {weekend.closes}</td></tr>
                <tr><th scope="row">점심시간</th><td>{site.lunchBreak}</td></tr>
                <tr><th scope="row">의료진</th><td>한의사 {site.doctorCount}명 (대표원장 {site.representative})</td></tr>
                <tr><th scope="row">주차</th><td>{site.parking}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section soft" aria-labelledby="treat-title">
        <div className="wrap">
          <h2 id="treat-title">{site.name}에서는 어떤 진료를 받을 수 있나요?</h2>
          <p className="answer narrow-text">교통사고 후유증, 통증, 추나, 한방 다이어트, 보약(면역력)을 진료합니다. 진료마다 대상, 치료 방법, 보험 적용을 정리한 안내 페이지가 있습니다.</p>
          <ul className="card-grid">
            {treatments.map((t) => (
              <li key={t.slug}>
                <Link className="card" href={`/treatments/${t.slug}/`}>
                  <img src={t.icon.src} width={64} height={64} alt={t.icon.alt} />
                  <h3>{t.name}</h3>
                  <p>{t.lead.split(". ")[0]}.</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="doc-title">
        <div className="wrap">
          <h2 id="doc-title">어떤 한의사가 진료하나요?</h2>
          <p className="answer narrow-text">
            {site.representative} 대표원장을 비롯한 한의사 {site.doctorCount}명이 요일·시간대별로 나누어 진료합니다. 그래서 평일 저녁과 주말에도 진료를 이어갈 수 있습니다.
          </p>
          <ul className="doc-strip">
            {doctors.map((d) => (
              <li key={d.photo.src}>
                <img src={d.photo.src} width={180} height={225} loading="lazy" alt={d.photo.alt} />
                <span>{d.name ? `${d.name} ${d.role}` : d.role}</span>
              </li>
            ))}
          </ul>
          <p>
            <Link className="text-link" href="/doctors/">의료진 소개 보기 →</Link>
          </p>
        </div>
      </section>

      <section className="section soft" aria-labelledby="blog-title">
        <div className="wrap">
          <h2 id="blog-title">진료실에서 자주 받는 질문을 글로 정리했나요?</h2>
          <p className="answer narrow-text">네. 보험 적용, 진료 순서, 이용 안내처럼 진료실에서 자주 받는 질문을 건강정보 글로 정리했습니다.</p>
          <ul className="card-grid">
            {posts.slice(0, 3).map((p) => (
              <li key={p.slug}>
                <Link className="card" href={`/blog/${p.slug}/`}>
                  <span className="tag">{p.category}</span>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="wrap narrow">
        <FaqList topic={site.name} faqs={homeFaqs} />
      </div>

      <section className="section" id="visit" aria-labelledby="visit-title">
        <div className="wrap visit-grid">
          <div>
            <h2 id="visit-title">{site.name}은 어디에 있나요?</h2>
            <p className="answer">
              {fullAddress}, {site.address.landmark}에 있습니다. {site.parking}이 가능하고, 버스·지하철로도 오실 수 있습니다.
            </p>
            <div className="table-wrap">
              <table className="info-table">
                <caption>{site.name} 오시는 길</caption>
                <tbody>
                  <tr><th scope="row">주소</th><td>{fullAddress}</td></tr>
                  <tr><th scope="row">주차</th><td>{site.parking}. {site.parkingDetail}</td></tr>
                  <tr><th scope="row">버스</th><td>{site.transit.bus}</td></tr>
                  <tr><th scope="row">지하철</th><td>{site.transit.subway}</td></tr>
                </tbody>
              </table>
            </div>
            <p className="map-links">
              <a className="btn ghost" href={site.maps.naver} target="_blank" rel="noopener">네이버 지도에서 보기</a>
              <a className="btn ghost" href={site.maps.kakao} target="_blank" rel="noopener">카카오맵에서 보기</a>
            </p>
          </div>
          <div>
            <h3>진료시간</h3>
            <HoursTable />
            <figure className="parking">
              <img src="/img/parking-indoor.jpg" width={1400} height={745} loading="lazy" alt={`${site.name} 건물 실내 주차장의 넓은 주차 공간`} />
              <figcaption>실내 주차장</figcaption>
            </figure>
          </div>
        </div>
      </section>
    </>
  );
}
