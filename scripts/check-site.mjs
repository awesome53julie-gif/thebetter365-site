#!/usr/bin/env node
/**
 * 빌드 결과(out/) 검사. `npm run build` 뒤에 자동 실행됩니다.
 * out/의 HTML은 자바스크립트를 실행하지 않은 크롤러가 받는 그대로의 문서입니다.
 *
 * 1. 본문이 HTML에 들어 있는지 (JS 없이)
 * 2. h1 1개, 제목 단계 건너뛰기 없음
 * 3. 시술·글 페이지: 질문형 H2 → 2~3문장 즉답
 * 4. FAQ 5개 + FAQPage 구조화 데이터 질문이 화면 질문과 일치
 * 5. 필수 스키마 (병원·의사 worksFor·Breadcrumb·Article)
 * 6. 모든 이미지에 서술형 alt
 * 7. NAP(이름·주소·전화)가 설정 파일에만 적혀 있는지
 * 8. sitemap lastmod, robots.txt AI 크롤러 허용
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "out");
const problems = [];
const fail = (where, msg) => problems.push(`${where}: ${msg}`);

const walk = (dir, filter) =>
  readdirSync(dir).flatMap((f) => {
    const p = path.join(dir, f);
    return statSync(p).isDirectory() ? walk(p, filter) : filter(p) ? [p] : [];
  });

const decode = (s) =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, "&");
const text = (h) => decode(h.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const sentences = (s) => (s.match(/[^.?!]+[.?!](?=\s|$)/g) ?? []).length;

if (!existsSync(OUT)) {
  console.error("out/ 폴더가 없습니다. 먼저 `npm run build`를 실행하세요.");
  process.exit(1);
}

const pages = walk(OUT, (p) => p.endsWith(".html") && !p.includes(`${path.sep}_next${path.sep}`));
let checked = 0;

for (const file of pages) {
  const rel = "/" + path.relative(OUT, file).replace(/\\/g, "/").replace(/index\.html$/, "");
  if (rel === "/404.html" || rel === "/_not-found/") continue;
  checked++;
  const html = readFileSync(file, "utf8");
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? "";
  const noindex = /<meta name="robots" content="noindex/.test(html);

  // 1. 본문 존재
  if (text(main).length < (noindex ? 20 : 300)) fail(rel, "HTML 본문 글자가 너무 적습니다 (JS로만 그려지는지 확인)");

  // 2. 제목 구조
  const heads = [...main.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/g)].map((m) => ({ level: +m[1], text: text(m[2]) }));
  if (heads.filter((h) => h.level === 1).length !== 1 || heads[0]?.level !== 1) fail(rel, "h1은 1개이고 가장 먼저 나와야 합니다");
  heads.forEach((h, i) => {
    if (i && h.level > heads[i - 1].level + 1) fail(rel, `h${heads[i - 1].level} 다음에 h${h.level}로 건너뜀: "${h.text}"`);
  });

  // 3. 질문형 H2 → 즉답 2~3문장
  const isQaPage = /^\/(treatments|blog)\/[^/]+\/$/.test(rel);
  const qa = [...main.matchAll(/<section class="qa">\s*<h2[^>]*>([\s\S]*?)<\/h2>\s*<p class="answer">([\s\S]*?)<\/p>/g)];
  if (isQaPage && qa.length < 3) fail(rel, `질문형 섹션이 ${qa.length}개뿐입니다 (3개 이상)`);
  for (const [, q, a] of qa) {
    if (!text(q).endsWith("?")) fail(rel, `H2가 질문형이 아닙니다: "${text(q)}"`);
    const n = sentences(text(a));
    if (n < 2 || n > 3) fail(rel, `즉답이 ${n}문장입니다 (2~3문장): "${text(q)}"`);
  }

  // 4·5. 구조화 데이터
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => {
    try {
      return JSON.parse(m[1]);
    } catch (e) {
      fail(rel, `JSON-LD 오류: ${e.message}`);
      return {};
    }
  });
  const types = ld.flatMap((d) => [d["@type"]].flat());
  const faqLd = ld.find((d) => d["@type"] === "FAQPage");
  const visibleFaq = [...main.matchAll(/<summary>\s*<h3[^>]*>([\s\S]*?)<\/h3>/g)].map((m) => text(m[1]));
  if (!noindex) {
    if (visibleFaq.length !== 5) fail(rel, `화면 FAQ가 ${visibleFaq.length}개입니다 (5개)`);
    if (!faqLd) fail(rel, "FAQPage 구조화 데이터가 없습니다");
  }
  if (faqLd) {
    const qs = faqLd.mainEntity.map((q) => q.name);
    if (qs.length !== 5) fail(rel, `FAQPage 질문이 ${qs.length}개입니다 (5개)`);
    qs.filter((q) => !visibleFaq.includes(q)).forEach((q) => fail(rel, `FAQPage 질문이 화면에 없습니다: "${q}"`));
  }
  if (rel !== "/" && !noindex && !types.includes("BreadcrumbList")) fail(rel, "BreadcrumbList 없음");
  if (/^\/blog\/[^/]+\/$/.test(rel) && !types.includes("Article")) fail(rel, "Article 없음");
  if (rel === "/") {
    if (!types.some((t) => ["MedicalClinic", "Dentist"].includes(t))) fail(rel, "병원(MedicalClinic/Dentist) 스키마 없음");
    const docs = ld.filter((d) => [d["@type"]].flat().includes("Physician"));
    if (!docs.length || docs.some((d) => !d.worksFor)) fail(rel, "Physician + worksFor 스키마 없음");
  }

  // 6. 이미지 alt
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    const alt = tag.match(/\balt="([^"]*)"/)?.[1];
    if (alt === undefined || decode(alt).trim().length < 8) fail(rel, `서술형 alt가 없는 이미지: ${tag.slice(0, 90)}`);
  }
}

// 7. NAP 단일 출처
const napPatterns = [/581[-\s.]?0175/, /계대동문로/, /847-90-01582/];
for (const f of walk(path.join(ROOT, "src"), (p) => /\.(ts|tsx)$/.test(p))) {
  const r = path.relative(ROOT, f).replace(/\\/g, "/");
  if (r === "src/config/site.ts") continue;
  const s = readFileSync(f, "utf8");
  napPatterns.forEach((re) => re.test(s) && fail(r, `병원 정보(${re.source})가 직접 적혀 있습니다. src/config/site.ts 값을 쓰세요`));
}

// 8. sitemap, robots
const sitemap = readFileSync(path.join(OUT, "sitemap.xml"), "utf8");
const urls = sitemap.match(/<url>[\s\S]*?<\/url>/g) ?? [];
if (!urls.length || urls.some((u) => !/<lastmod>\d{4}-\d{2}-\d{2}/.test(u))) fail("sitemap.xml", "lastmod 없는 주소가 있습니다");
const robots = readFileSync(path.join(OUT, "robots.txt"), "utf8");
for (const bot of ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"]) {
  const block = robots.split(/\n\s*\n/).find((b) => new RegExp(`User-Agent: ${bot}\\b`, "i").test(b));
  if (!block || !/Allow: \//.test(block) || /Disallow: \/\s*$/m.test(block)) fail("robots.txt", `${bot} 허용 규칙 없음`);
}

if (problems.length) {
  console.error(`\n구조 검사 실패 (${problems.length}건):`);
  problems.forEach((p) => console.error("  - " + p));
  process.exit(1);
}
console.log(`구조 검사 통과: 페이지 ${checked}개, 사이트맵 주소 ${urls.length}개`);
