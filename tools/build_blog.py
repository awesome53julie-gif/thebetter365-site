#!/usr/bin/env python3
"""블로그 빌더: blog/_posts/*.md → blog/*.html, blog/index.html, sitemap.xml

사용법:  python3 tools/build_blog.py
외부 라이브러리 없이 파이썬 3.8+ 기본 기능만 사용합니다.
"""
import html, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
POSTS = ROOT / "blog" / "_posts"
OUT = ROOT / "blog"
DOMAIN = "https://thebetter365ss.kr"
CLINIC_ID = DOMAIN + "/#clinic"
TEMPLATE = ROOT / "privacy.html"  # 머리글·바닥글을 가져올 페이지

STATIC_PAGES = [  # (경로, priority, changefreq)
    ("", 1.0, "weekly"),
    ("clinic-traffic.html", 0.9, "monthly"),
    ("clinic-pain.html", 0.9, "monthly"),
    ("clinic-chuna.html", 0.9, "monthly"),
    ("clinic-diet.html", 0.9, "monthly"),
    ("clinic-immune.html", 0.9, "monthly"),
    ("mission.html", 0.7, "monthly"),
    ("blog/", 0.8, "weekly"),
    ("sitemap.html", 0.3, "yearly"),
]


# ---------------------------------------------------------------- markdown
def inline(t):
    t = html.escape(t, quote=False)
    t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"\[([^\]]+)\]\(([^)\s]+)\)", lambda m: f'<a href="{m.group(2)}">{m.group(1)}</a>', t)
    return t


def slugify(t, used):
    s = re.sub(r"[^\w가-힣]+", "-", t).strip("-").lower() or "section"
    base, i = s, 2
    while s in used:
        s, i = f"{base}-{i}", i + 1
    used.add(s)
    return s


def md_to_html(md):
    """지원: ## / ### 제목, 문단, - 목록, 1. 목록, | 표 |, > 인용, **굵게**, [링크](주소)"""
    lines = md.strip().split("\n")
    out, toc, faqs, used = [], [], [], set()
    i, in_faq, cur_q = 0, False, None
    while i < len(lines):
        ln = lines[i].rstrip()
        if not ln.strip():
            i += 1
            continue
        m = re.match(r"^(#{2,3})\s+(.*)", ln)
        if m:
            lvl, text = len(m.group(1)), m.group(2).strip()
            hid = slugify(text, used)
            out.append(f'<h{lvl} id="{hid}">{inline(text)}</h{lvl}>')
            if lvl == 2:
                toc.append((hid, text))
                in_faq = "자주 묻는 질문" in text
            elif in_faq:
                cur_q = text
            i += 1
            continue
        if ln.startswith("|"):
            rows = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                cells = [c.strip() for c in lines[i].strip().strip("|").split("|")]
                if not all(re.fullmatch(r":?-{2,}:?", c) for c in cells):
                    rows.append(cells)
                i += 1
            head, body = rows[0], rows[1:]
            t = ['<div class="table-wrap"><table class="summary">', "<thead><tr>"]
            t += [f'<th scope="col">{inline(c)}</th>' for c in head]
            t.append("</tr></thead><tbody>")
            for r in body:
                t.append("<tr>" + f'<th scope="row">{inline(r[0])}</th>' + "".join(f"<td>{inline(c)}</td>" for c in r[1:]) + "</tr>")
            t.append("</tbody></table></div>")
            out.append("".join(t))
            continue
        if re.match(r"^(-|\d+\.)\s", ln):
            tag = "ol" if ln[0].isdigit() else "ul"
            items = []
            while i < len(lines) and re.match(r"^(-|\d+\.)\s", lines[i]):
                items.append(re.sub(r"^(-|\d+\.)\s+", "", lines[i]).strip())
                i += 1
            out.append(f"<{tag}>" + "".join(f"<li>{inline(x)}</li>" for x in items) + f"</{tag}>")
            continue
        if ln.startswith(">"):
            q = []
            while i < len(lines) and lines[i].startswith(">"):
                q.append(lines[i][1:].strip())
                i += 1
            out.append(f'<blockquote>{inline(" ".join(q))}</blockquote>')
            continue
        para = []
        while i < len(lines) and lines[i].strip() and not re.match(r"^(#{2,3}\s|\||>|-\s|\d+\.\s)", lines[i]):
            para.append(lines[i].strip())
            i += 1
        text = " ".join(para)
        out.append(f"<p>{inline(text)}</p>")
        if in_faq and cur_q:
            faqs.append((cur_q, re.sub(r"\*\*|\[|\]\([^)]*\)", "", text)))
            cur_q = None
    return "\n".join(out), toc, faqs


def parse_post(path):
    raw = path.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", raw, re.S)
    if not m:
        sys.exit(f"{path.name}: 맨 위에 --- 로 감싼 정보(제목 등)가 없습니다")
    meta = {}
    for ln in m.group(1).split("\n"):
        if ":" in ln:
            k, v = ln.split(":", 1)
            meta[k.strip()] = v.strip()
    for k in ("title", "slug", "date", "description"):
        if not meta.get(k):
            sys.exit(f"{path.name}: '{k}' 항목이 비어 있습니다")
    meta.setdefault("updated", meta["date"])
    meta["body"], meta["toc"], meta["faqs"] = md_to_html(m.group(2))
    return meta


# ---------------------------------------------------------------- template
def chrome():
    s = TEMPLATE.read_text(encoding="utf-8")
    top = s[s.index("<body>") + 6 : s.index('<main id="top">')]
    bottom = s[s.index("</main>") + 7 : s.index("</body>")]

    def fix(part):  # 하위 폴더(blog/)에서 상대 경로가 맞도록 ../ 붙이기
        return re.sub(r'(href|src)="(?!https?:|#|tel:|mailto:|data:|/)([^"]*)"',
                      lambda m: f'{m.group(1)}="../{m.group(2)}"', part)

    return fix(top), fix(bottom)


def head(title, desc, url, ld, og_type="website"):
    t, d = html.escape(title), html.escape(desc)
    lds = "\n".join(f'<script type="application/ld+json">\n{json.dumps(x, ensure_ascii=False, indent=1)}\n</script>' for x in ld)
    return f"""<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{t}</title>
<meta name="description" content="{d}">
{lds}
<link rel="canonical" href="{url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#ffe001">
<meta property="og:type" content="{og_type}">
<meta property="og:site_name" content="더나은365한의원">
<meta property="og:locale" content="ko_KR">
<meta property="og:url" content="{url}">
<meta property="og:title" content="{t}">
<meta property="og:description" content="{d}">
<meta property="og:image" content="{DOMAIN}/img/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="../favicon.ico" sizes="48x48">
<link rel="icon" href="../img/icon-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="../img/apple-touch-icon.png">
<link rel="preload" href="../fonts/PretendardVariable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="../styles.css">
</head>
<body>"""


def crumbs(items):
    return {"@context": "https://schema.org", "@type": "BreadcrumbList",
            "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": n, "item": u} for i, (n, u) in enumerate(items)]}


def kdate(d):
    y, m, dd = d.split("-")
    return f"{y}년 {int(m)}월 {int(dd)}일"


# ---------------------------------------------------------------- build
def build():
    top, bottom = chrome()
    posts = sorted((parse_post(p) for p in POSTS.glob("*.md")), key=lambda p: p["date"], reverse=True)
    for p in posts:
        url = f"{DOMAIN}/blog/{p['slug']}.html"
        author = ({"@type": "Person", "name": p["author"], "worksFor": {"@id": CLINIC_ID}}
                  if p.get("author") else {"@id": CLINIC_ID})
        article = {"@context": "https://schema.org", "@type": "BlogPosting", "headline": p["title"],
                   "description": p["description"], "datePublished": p["date"], "dateModified": p["updated"],
                   "inLanguage": "ko-KR", "mainEntityOfPage": url, "image": f"{DOMAIN}/img/og-image.jpg",
                   "author": author, "publisher": {"@id": CLINIC_ID}}
        if p.get("category"):
            article["articleSection"] = p["category"]
        if p.get("reviewed_by"):
            article["reviewedBy"] = {"@type": "Person", "name": p["reviewed_by"]}
        ld = [article, crumbs([("홈", DOMAIN + "/"), ("건강정보", DOMAIN + "/blog/"), (p["title"], url)])]
        if p["faqs"]:
            ld.append({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
                {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in p["faqs"]]})
        toc = "".join(f'<li><a href="#{h}">{inline(t)}</a></li>' for h, t in p["toc"])
        byline = f"글 · {html.escape(p.get('author') or '더나은365한의원')}"
        if p.get("reviewed_by"):
            byline += f" · 검수 · {html.escape(p['reviewed_by'])}"
        related = ""
        if p.get("related"):
            href, label = (p["related"].split(" ", 1) + [""])[:2]
            related = f'<p class="post-related">관련 진료 안내: <a href="../{href}">{html.escape(label or href)} →</a></p>'
        page = head(f"{p['title']} | 더나은365한의원", p["description"], url, ld, "article") + top + f"""<main id="top">
<article class="post">
  <section class="page-hero" style="padding-block:40px 44px">
    <div class="wrap">
      <nav class="crumb" aria-label="현재 위치"><a href="../">홈</a><span>›</span><a href="./">건강정보</a><span>›</span><span>{html.escape(p.get('category', '글'))}</span></nav>
      <h1>{html.escape(p['title'])}</h1>
      <p class="lead">{html.escape(p['description'])}</p>
      <p class="post-meta">{byline} · <time datetime="{p['date']}">{kdate(p['date'])}</time>{f' · 수정 <time datetime="{p["updated"]}">{kdate(p["updated"])}</time>' if p['updated'] != p['date'] else ''}</p>
    </div>
  </section>
  <section>
    <div class="wrap post-wrap">
      <nav class="toc" aria-label="목차"><b>목차</b><ol>{toc}</ol></nav>
      <div class="post-body">
{p['body']}
{related}
        <p class="disclaim">※ 이 글은 일반적인 건강 정보이며 진료를 대체하지 않습니다. 정확한 진단과 치료는 한의사와 상담하세요.</p>
      </div>
    </div>
  </section>
</article>
<aside aria-label="관련 안내">
  <section class="cta-band" aria-label="진료 예약">
    <div class="wrap">
      <div><h2>365일 점심시간 없이 진료합니다</h2><p>평일 09:00–20:00 · 토·일·공휴일 09:00–15:00</p></div>
      <a class="btn" href="tel:053-581-0175"><svg class="i" aria-hidden="true"><use href="#i-phone"/></svg>053-581-0175 전화 예약</a>
    </div>
  </section>
</aside>
</main>""" + bottom + "</body>\n</html>\n"
        (OUT / f"{p['slug']}.html").write_text(page, encoding="utf-8")

    # 목록 페이지
    url = DOMAIN + "/blog/"
    items = "".join(f"""<li class="post-card"><a href="{p['slug']}.html"><span class="cat">{html.escape(p.get('category', '글'))}</span><h2>{html.escape(p['title'])}</h2><p>{html.escape(p['description'])}</p><time datetime="{p['date']}">{kdate(p['date'])}</time></a></li>""" for p in posts)
    ld = [{"@context": "https://schema.org", "@type": "Blog", "name": "더나은365한의원 건강정보", "url": url,
           "inLanguage": "ko-KR", "publisher": {"@id": CLINIC_ID},
           "blogPost": [{"@type": "BlogPosting", "headline": p["title"], "url": f"{DOMAIN}/blog/{p['slug']}.html", "datePublished": p["date"]} for p in posts]},
          crumbs([("홈", DOMAIN + "/"), ("건강정보", url)])]
    page = head("건강정보 | 성서 더나은365한의원", "대구 달서구 성서 더나은365한의원 건강정보. 교통사고 후유증, 통증, 추나, 진료 이용 안내 등 한의원 진료에 대해 자주 받는 질문을 정리했습니다.", url, ld) + top + f"""<main id="top">
  <section class="page-hero" style="padding-block:40px 44px">
    <div class="wrap">
      <nav class="crumb" aria-label="현재 위치"><a href="../">홈</a><span>›</span><span>건강정보</span></nav>
      <h1>건강정보</h1>
      <p class="lead">진료실에서 자주 받는 질문을 글로 정리했습니다.</p>
    </div>
  </section>
  <section>
    <div class="wrap"><ul class="post-list">{items}</ul></div>
  </section>
</main>""" + bottom + "</body>\n</html>\n"
    (OUT / "index.html").write_text(page, encoding="utf-8")

    # 메인 최신 글 3개, 사이트맵 페이지 목록 (주석 표시 사이를 교체)
    def fill(fname, tag, content):
        f = ROOT / fname
        s = f.read_text(encoding="utf-8")
        s = re.sub(rf"<!--{tag}-->.*?<!--/{tag}-->", lambda m: f"<!--{tag}-->{content}<!--/{tag}-->", s, flags=re.S)
        f.write_text(s, encoding="utf-8")
    fill("index.html", "blog-cards", "".join(
        f"""<li class="post-card"><a href="blog/{p['slug']}.html"><span class="cat">{html.escape(p.get('category', '글'))}</span><h3 style="font-size:20px;font-weight:900;margin:14px 0 8px;line-height:1.4">{html.escape(p['title'])}</h3><p>{html.escape(p['description'])}</p></a></li>""" for p in posts[:3]))
    fill("sitemap.html", "blog-list", "".join(f'<li><a href="blog/{p["slug"]}.html">{html.escape(p["title"])}</a></li>' for p in posts))

    # sitemap.xml
    x = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    newest = posts[0]["updated"] if posts else None
    for path, pr, cf in STATIC_PAGES:
        lm = f"<lastmod>{newest}</lastmod>" if path == "blog/" and newest else ""
        x.append(f"  <url><loc>{DOMAIN}/{path}</loc>{lm}<changefreq>{cf}</changefreq><priority>{pr}</priority></url>")
    for p in posts:
        x.append(f"  <url><loc>{DOMAIN}/blog/{p['slug']}.html</loc><lastmod>{p['updated']}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>")
    x.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(x) + "\n", encoding="utf-8")
    print(f"글 {len(posts)}개 생성 → blog/, sitemap.xml 갱신")


if __name__ == "__main__":
    build()
