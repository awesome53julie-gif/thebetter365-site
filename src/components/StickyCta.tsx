import Link from "next/link";
import { site, telHref } from "@/config/site";

/** 모든 화면 하단에 고정되는 전화·예약 버튼 */
export function StickyCta() {
  return (
    <aside className="sticky-cta" aria-label="빠른 예약">
      <a className="cta-call" href={telHref}>
        <span className="cta-label">전화 예약</span>
        <span className="cta-num">{site.phone.display}</span>
      </a>
      <Link className="cta-book" href="/reservation/">
        예약 신청
      </Link>
    </aside>
  );
}
