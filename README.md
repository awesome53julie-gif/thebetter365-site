# 더나은365한의원 성서이곡 홈페이지

대구광역시 달서구 계대동문로 124, 2층 · 053-581-0175

별도 빌드 없이 그대로 열리는 정적 홈페이지입니다.

## 페이지
| 파일 | 내용 |
|---|---|
| `index.html` | 메인: 진료시간, 진료철학, 대표 진료, 둘러보기, 의료진, 오시는 길 |
| `mission.html` | 핵심 진료철학 (진심 · 소통 · 신뢰) |
| `clinic-traffic.html` | 교통사고 후유증 |
| `clinic-pain.html` | 통증치료 |
| `clinic-chuna.html` | 추나치료 |
| `clinic-diet.html` | 다이어트 |
| `clinic-immune.html` | 면역력 |
| `privacy.html` · `terms.html` · `sitemap.html` | 개인정보 처리방침 · 이용약관 · 사이트맵 |
| `styles.css` · `fonts/` | 공통 스타일 · Pretendard 글꼴 |
| `robots.txt` · `sitemap.xml` · `llms.txt` | 검색엔진·AI 크롤러 수집 허용 · 페이지 목록 · AI용 사이트 요약 (sitemap.xml·llms.txt는 빌더가 자동 생성) |
| `blog/` · `tools/build_blog.py` | 건강정보 글 · 글 생성 도구 |
| `img/` | 사진 · 아이콘 · 로고 |

## 아직 채워야 할 부분
- 유덕순 대표원장 학력 · 경력 (`index.html`의 `(학력 입력)`, `(경력·소속 학회 입력)`)
- 한의사 2명 이름 (`index.html`의 `(이름 확인)`)
- 개인정보 처리방침 · 이용약관 정식 문서 (`privacy.html`, `terms.html`)
- 하단 "카톡상담" 버튼: 카카오톡 채널 주소가 생기면 링크 연결 (지금은 오시는 길로 이동)
- 진료 상태 배지는 공휴일을 따로 구분하지 않습니다 (평일 공휴일에도 20시까지로 표시)

## 건강정보(블로그) 글 쓰기
글은 홈페이지 안 `blog/` 폴더에 올라가 `thebetter365ss.kr/blog/...` 주소가 됩니다. 외부 서비스 없이 자사 도메인 자산으로 쌓입니다.

1. `blog/_posts/`에 `.md` 파일을 만듭니다 (기존 글을 복사해서 고치면 편합니다)
2. 맨 위 정보 칸을 채웁니다
   ```
   ---
   title: 글 제목 (검색어가 들어가게)
   slug: 주소에-쓸-영문 (예: neck-pain-guide)
   date: 2026-10-08
   updated: 2026-11-01        ← 내용을 고쳤을 때만
   description: 검색 결과에 나올 2~3문장 요약
   category: 교통사고
   author: 유덕순             ← 한의사 이름 (비우면 '더나은365한의원')
   reviewed_by: 유덕순        ← 검수한 한의사 (선택)
   related: clinic-traffic.html 교통사고 후유증 진료 안내
   ---
   ```
3. 본문 작성 규칙: `## 질문형 소제목` → 바로 아래 첫 문장에 답. `| 표 |`로 핵심 정리, `- 목록`, `**굵게**`, `[링크](주소)`
   `## 자주 묻는 질문` 아래 `### 질문` + 답 문단을 쓰면 FAQ 구조화 데이터가 자동으로 만들어집니다
4. `python3 tools/build_blog.py` 실행 → 글 페이지, 글 목록, 메인 최신 글 3개, 사이트맵이 한 번에 갱신됩니다

주의: 치료 효과 보장, 다른 병원과 비교, 환자 후기, "최고·유일·전문" 같은 표현은 의료광고 규정 위반 소지가 있습니다.
가격(비급여 진료비)은 확정된 금액만 적고, 바뀌면 바로 고쳐 주세요.

## SEO
코드에 적용된 것
- 페이지별 검색어 제목: "성서 한의원", "성서 교통사고 한의원", "성서 추나치료" 등
- canonical 주소, 공유 미리보기(OG) 이미지 `img/og-image.jpg`, 파비콘
- 구조화 데이터: 한의원 정보(주소·전화·진료시간·진료과목), 경로(Breadcrumb), 진료별 FAQ
- `robots.txt`, `sitemap.xml`
- 내용이 준비 중인 개인정보 처리방침 · 이용약관은 검색 제외(noindex). 정식 문서를 넣으면 `noindex, follow`를 `index, follow`로 바꾸세요.
- 글꼴을 CSS에서 분리해 첫 화면 로딩 속도 개선 (CSS 625KB → 34KB)

모든 주소는 `https://thebetter365ss.kr` 기준입니다. 다른 도메인을 쓰면 전체 파일에서 이 주소를 바꿔 주세요.

AI·검색엔진이 읽기 쉬운 구조 (콘텐츠 수정 시 지켜 주세요)
- 제목은 h1 1개 → h2(섹션) → h3(하위 항목) 순서로. 제목 문구는 "무엇에 대한 섹션인지" 드러나게
- 핵심 정보는 이미지가 아닌 **텍스트**로. 이미지 속 글자는 alt와 캡션에도 같은 내용을 적기
- 사실 정보는 표(`<table>` + 행 제목 `<th>`), 나열은 목록(`<ul>`), 질문은 Q&A(`<details>`)로
- 진료 페이지 본문은 `<article>`, "다른 진료 보기"·예약 배너는 `<aside>`
- 메인 "한눈에 보기" 표·FAQ와 구조화 데이터(JSON-LD)는 내용이 같아야 함. 진료시간 등이 바뀌면 둘 다 수정

사이트 공개 후 직접 해야 하는 것 (검색 노출에 가장 중요)
1. **네이버 서치어드바이저** (searchadvisor.naver.com): 사이트 등록 → 소유 확인용 `<meta name="naver-site-verification">` 태그를 받아 `index.html` `<head>`에 추가 → `sitemap.xml` 제출 → 웹 페이지 수집 요청
2. **구글 서치 콘솔** (search.google.com/search-console): 같은 방식으로 등록 후 `sitemap.xml` 제출
3. **네이버 플레이스**: 업체 정보의 홈페이지 주소를 이 사이트로 등록 (지역 검색은 플레이스 영향이 큼)
4. 다음(카카오) 검색 등록: register.search.daum.net

## 미리보기
`index.html`을 브라우저로 열면 됩니다.

## 배포
GitHub Pages: 저장소 Settings → Pages → Branch `main` / `(root)`.
도메인(thebetter365ss.kr)을 연결하려면 같은 화면의 Custom domain에 입력하고 DNS를 설정하세요.
도메인이 연결되기 전까지는 canonical 주소가 아직 열리지 않는 도메인을 가리키므로, 검색 등록은 도메인 연결 후에 하세요.
