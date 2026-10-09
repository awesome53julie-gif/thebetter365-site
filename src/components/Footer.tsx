import Link from "next/link";
import { site, fullAddress, telHref } from "@/config/site";
import { treatments } from "@/content/treatments";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <p className="footer-name">{site.name} <span>{site.branch}</span></p>
          <p>{fullAddress} ({site.address.landmark})</p>
          <p>
            전화 <a href={telHref}>{site.phone.display}</a>
          </p>
          <p>
            {site.hours.map((h) => `${h.days} ${h.opens}–${h.closes}`).join(" · ")} · 점심시간 {site.lunchBreak}
          </p>
        </div>
        <nav aria-label="진료 안내">
          <p className="footer-title">진료 안내</p>
          <ul>
            {treatments.map((t) => (
              <li key={t.slug}>
                <Link href={`/treatments/${t.slug}/`}>{t.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="병원 안내">
          <p className="footer-title">병원 안내</p>
          <ul>
            <li><Link href="/doctors/">의료진</Link></li>
            <li><Link href="/about/">진료철학</Link></li>
            <li><Link href="/blog/">건강정보</Link></li>
            <li><Link href="/reservation/">예약 신청</Link></li>
            <li><Link href="/privacy/">개인정보 처리방침</Link></li>
            <li><Link href="/terms/">이용약관</Link></li>
          </ul>
        </nav>
      </div>
      <div className="wrap footer-legal">
        <p>
          상호 {site.legalName} · 대표 {site.representative} · 사업자등록번호 {site.businessNumber}
        </p>
        <p>
          이 홈페이지의 의료 정보는 일반적인 이해를 돕기 위한 것으로 진료를 대체하지 않습니다. 치료 효과와 반응은 사람마다 다를 수 있으며, 정확한 진단과 치료는 한의사와 상담하세요.
        </p>
      </div>
    </footer>
  );
}
