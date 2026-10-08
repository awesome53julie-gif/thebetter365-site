#!/usr/bin/env python3
"""사이트 구조 검사: python3 tools/check_site.py

- 페이지마다 h1이 1개이고 첫 제목인지
- 제목 단계를 건너뛰지 않는지 (h2 다음 바로 h4 등)
- 구조화 데이터(JSON-LD)가 올바른 JSON인지
- FAQ 구조화 데이터의 질문이 화면의 제목과 같은지
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def text(h):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", h)).strip()


def faq_questions(node):
    if isinstance(node, dict):
        if node.get("@type") == "FAQPage":
            yield from (q["name"] for q in node.get("mainEntity", []))
        for v in node.values():
            yield from faq_questions(v)
    elif isinstance(node, list):
        for v in node:
            yield from faq_questions(v)


problems = []
pages = sorted(list(ROOT.glob("*.html")) + list(ROOT.glob("blog/*.html")))
for f in pages:
    name = f.relative_to(ROOT).as_posix()
    s = f.read_text(encoding="utf-8")
    body = s[s.index("<body"):]
    hs = [(int(m.group(1)), text(m.group(2))) for m in re.finditer(r"<h([1-6])[^>]*>(.*?)</h\1>", body, re.S)]
    if not hs or hs[0][0] != 1 or [l for l, _ in hs].count(1) != 1:
        problems.append(f"{name}: h1은 1개, 그리고 가장 먼저 나와야 합니다")
    for (a, _), (b, t) in zip(hs, hs[1:]):
        if b > a + 1:
            problems.append(f"{name}: h{a} 다음에 h{b}로 건너뜀 → '{t}'")
    visible = {t for _, t in hs}
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', s, re.S):
        try:
            data = json.loads(block)
        except json.JSONDecodeError as e:
            problems.append(f"{name}: 구조화 데이터 JSON 오류 ({e})")
            continue
        for q in faq_questions(data):
            if q not in visible:
                problems.append(f"{name}: FAQ 구조화 데이터 질문이 화면 제목에 없음 → '{q}'")

if problems:
    print("구조 검사 실패:")
    print("\n".join("  - " + p for p in problems))
    sys.exit(1)
print(f"구조 검사 통과 ({len(pages)}개 페이지)")
