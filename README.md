# 더나은365한의원 홈페이지

Next.js(App Router) + 정적 사이트 생성(SSG). `npm run build`를 하면 `out/` 폴더에 순수 HTML 사이트가 만들어지고, 어떤 웹호스팅에도 그대로 올릴 수 있습니다.

## 실행
```bash
npm install
npm run dev     # 개발 서버 http://localhost:3000
npm run build   # out/ 생성 + 구조 검사
```

## 어디를 고치면 되나요?
| 바꿀 것 | 파일 |
|---|---|
| 병원 이름·주소·전화·진료시간·주차·교통 | `src/config/site.ts` (**이 파일에만** 적습니다) |
| GA4·서치콘솔·Bing·네이버 확인 태그, 예약폼 받는 주소 | `src/config/site.ts` 또는 환경변수 (아래) |
| 시술(진료) 페이지 원고 | `src/content/treatments/*.ts` |
| 건강정보 글 | `src/content/posts/*.ts` |
| 의료진 | `src/content/doctors.ts` |
| 메인·의료진·진료철학·예약 페이지 FAQ | `src/content/pages.ts` |
| 디자인 | `src/app/globals.css` |

## 원고 작성 규칙 (빌드 때 자동 검사)
- 시술·글 페이지 본문: **질문형 H2 → 2~3문장 즉답 → 상세설명**. `QaSection` 타입으로 강제되고, 즉답 문장 수는 검사 스크립트가 셉니다.
- FAQ는 페이지마다 **정확히 5개** (`Faqs` 타입). FAQPage 구조화 데이터가 자동으로 붙습니다.
- 전문용어는 **환자 말을 앞에, 전문용어는 괄호로**: "손으로 척추·관절을 바로잡는 치료(추나요법)", "건강보험이 적용되지 않는 항목(비급여)"
- 글자를 이미지로 넣지 않습니다. 모든 이미지에 무엇이 보이는지 설명하는 alt를 씁니다.
- 병원 정보를 원고에 직접 쓰지 말고 `site.phone.display` 처럼 설정 값을 씁니다. 직접 쓰면 빌드가 실패합니다.
- 의료광고 주의: 치료 효과 보장, 다른 병원과 비교, 환자 후기, "최고·유일·전문" 표현 금지.

새 시술 페이지는 `src/content/treatments/`에 파일을 하나 복사해 고치고 `index.ts` 목록에 추가하면 메뉴·사이트맵·스키마까지 자동으로 붙습니다.

## `npm run build`가 확인하는 것 (`scripts/check-site.mjs`)
`out/`의 HTML(=자바스크립트를 실행하지 않는 크롤러가 받는 문서)을 검사합니다.
1. 본문 글자가 HTML에 들어 있는지
2. h1 1개, 제목 단계 건너뛰기 없음
3. 시술·글 페이지의 질문형 H2와 2~3문장 즉답
4. FAQ 5개, FAQPage 질문 = 화면 질문
5. 병원(MedicalClinic)·의사(Physician + worksFor)·BreadcrumbList·Article 스키마
6. 모든 이미지의 서술형 alt
7. 병원 정보가 설정 파일 밖에 적혀 있지 않은지
8. sitemap.xml의 lastmod, robots.txt의 GPTBot·ClaudeBot·PerplexityBot·Google-Extended 허용

## 구조화 데이터
- 메인: 병원(`MedicalClinic`) + 의사 5명(`Physician`, `worksFor`로 병원 연결) + `WebSite` + `FAQPage`
- 시술: `MedicalWebPage` + `BreadcrumbList` + `FAQPage`
- 건강정보 글: `Article` (글쓴이·검수자가 의료진이면 의사 정보와 연결) + `BreadcrumbList` + `FAQPage`
- 치과라면 `site.ts`의 `schemaType`을 `"Dentist"`로 바꾸면 됩니다. 한의원은 `MedicalClinic`이 맞습니다.

## 사이트맵 수정일
`sitemap.xml`의 lastmod는 각 페이지를 만드는 원고 파일의 **마지막 git 커밋 날짜**입니다(빌드한 날짜가 아님). 배포 서버에서 빌드할 때는 git 기록 전체가 필요합니다(GitHub Actions라면 `actions/checkout`에 `fetch-depth: 0`).

## 분석·검색 등록 태그 / 예약폼
`src/config/site.ts`에 직접 넣거나, 빌드 환경변수로 넣습니다. 비어 있으면 태그를 출력하지 않습니다.
```
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=...
NEXT_PUBLIC_BING_SITE_VERIFICATION=...
NEXT_PUBLIC_NAVER_SITE_VERIFICATION=...
NEXT_PUBLIC_RESERVATION_ENDPOINT=https://formspree.io/f/xxxx   # 예약 신청을 받을 주소
```
정적 사이트라 예약 신청을 직접 저장할 서버가 없습니다. Formspree·Google Apps Script 같은 폼 수신 서비스 주소를 넣으면 이름·연락처가 그쪽으로 전달됩니다. 주소가 비어 있으면 폼은 보이되 제출 버튼이 꺼지고 전화 예약을 안내합니다.

## 배포 전 확인
- [ ] 이름이 비어 있는 한의사 2명 (`src/content/doctors.ts`)
- [ ] 개인정보 처리방침·이용약관 정식 문서 (`src/app/privacy`, `src/app/terms`, 지금은 검색 제외)
- [ ] 예약폼 동의 문구의 보유 기간이 실제 운영과 맞는지
- [ ] 한의사가 시술·건강정보 원고 검토 → 글의 `reviewedBy`에 이름 기입
- [ ] 도메인(thebetter365ss.kr) 연결 후 서치콘솔·네이버 서치어드바이저·Bing에 `sitemap.xml` 제출
