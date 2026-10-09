import Link from "next/link";
import { site, telHref } from "@/config/site";
import { treatments } from "@/content/treatments";

const menu = [
  { href: "/treatments/", label: "진료 안내" },
  { href: "/doctors/", label: "의료진" },
  { href: "/about/", label: "진료철학" },
  { href: "/blog/", label: "건강정보" },
  { href: "/#visit", label: "오시는 길" },
];

export function Header() {
  return (
    <header className="site-header">
      <div className="wrap header-bar">
        <Link className="logo" href="/" aria-label={`${site.name} 홈`}>
          <img src="/img/logo-mark.png" width={40} height={40} alt={`${site.name} 원형 로고 마크`} />
          <span className="logo-name">
            <b>{site.name}</b>
            <small>{site.branch}</small>
          </span>
        </Link>
        <nav className="gnb" aria-label="주요 메뉴">
          <ul>
            {menu.map((m) => (
              <li key={m.href}>
                <Link href={m.href}>{m.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <a className="header-tel" href={telHref}>{site.phone.display}</a>
        {/* 모바일 메뉴: JS 없이 열리고 닫히는 <details> */}
        <details className="mobile-menu">
          <summary aria-label="전체 메뉴">메뉴</summary>
          <nav aria-label="전체 메뉴">
            <ul>
              {menu.map((m) => (
                <li key={m.href}>
                  <Link href={m.href}>{m.label}</Link>
                  {m.href === "/treatments/" && (
                    <ul>
                      {treatments.map((t) => (
                        <li key={t.slug}>
                          <Link href={`/treatments/${t.slug}/`}>{t.name}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              <li>
                <Link href="/reservation/">예약 신청</Link>
              </li>
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}
