/**
 * 병원 기본 정보(NAP: 이름·주소·전화)와 사이트 설정의 단일 출처.
 *
 * 병원 이름, 주소, 전화번호, 진료시간은 이 파일에서만 적습니다.
 * 페이지·원고·구조화 데이터는 모두 여기 값을 가져다 씁니다.
 * (`npm run check`가 다른 파일에 전화번호·주소가 직접 적혀 있으면 실패 처리합니다.)
 */

export const site = {
  /** 사이트 주소 (끝에 / 없이) */
  url: "https://thebetter365ss.kr",

  // ── NAP ────────────────────────────────────────────────
  name: "더나은365한의원",
  branch: "성서이곡",
  /** 상호 (사업자등록 기준) */
  legalName: "더나은365한의원 성서이곡",
  phone: {
    display: "053-581-0175",
    /** 국제 표기 (구조화 데이터용) */
    international: "+82-53-581-0175",
  },
  address: {
    region: "대구광역시",
    locality: "달서구",
    street: "계대동문로 124, 2층",
    country: "KR",
    /** 환자가 실제로 쓰는 동네 이름 */
    neighborhood: "성서 이곡동",
    /** 찾아오는 기준 건물 */
    landmark: "국민연금네거리 iM뱅크(대구은행) 이곡동지점 2층",
  },

  // ── 진료 ───────────────────────────────────────────────
  /**
   * 구조화 데이터의 병원 유형.
   * 한의원은 "MedicalClinic", 치과라면 "Dentist"로 바꾸세요.
   * (한의원에 Dentist를 쓰면 AI·검색엔진이 치과로 오인합니다.)
   */
  schemaType: "MedicalClinic" as "MedicalClinic" | "Dentist",
  specialty: "한방(한의학)",
  hours: [
    {
      label: "평일",
      days: "월–금",
      schemaDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "20:00",
      note: "매일 야간진료",
    },
    {
      label: "토·일·공휴일",
      days: "토·일·공휴일",
      schemaDays: ["Saturday", "Sunday", "PublicHolidays"],
      opens: "09:00",
      closes: "15:00",
      note: "주말·공휴일 진료",
    },
  ],
  lunchBreak: "없음",
  doctorCount: 7,
  representative: "유덕순",
  businessNumber: "847-90-01582",
  parking: "무료주차 31대 (SUV 가능)",
  parkingDetail: "건물 뒤편으로 돌아오면 주차장 입구가 있고, 주차 후 한의원으로 바로 연결됩니다.",
  transit: {
    bus: "성서우방타운 건너편 정류장 하차 (405 · 503 · 527 · 564 · 달서3 · 달서5 · 급행5), 정류장 바로 앞 건물",
    subway: "2호선 성서산업단지역 8번 출구, 도보 약 6분",
  },
  maps: {
    naver: "https://map.naver.com/p/entry/place/1649181334",
    kakao: "https://map.kakao.com/?q=%EB%8D%94%EB%82%98%EC%9D%80365%ED%95%9C%EC%9D%98%EC%9B%90",
  },
  areaServed: ["대구광역시", "대구 달서구", "성서", "이곡동"],

  // ── 예약폼 ─────────────────────────────────────────────
  reservation: {
    /**
     * 예약 신청을 받을 주소 (예: Formspree, Google Apps Script 웹앱 URL).
     * 비워 두면 폼은 보이지만 제출 버튼이 꺼지고 전화 예약을 안내합니다.
     */
    endpoint: process.env.NEXT_PUBLIC_RESERVATION_ENDPOINT ?? "",
  },

  // ── 분석·검색 등록 태그 슬롯 ───────────────────────────
  // 각 서비스에서 받은 값만 넣으면 됩니다. 비어 있으면 태그를 출력하지 않습니다.
  analytics: {
    /** GA4 측정 ID (예: G-XXXXXXXXXX) */
    ga4Id: process.env.NEXT_PUBLIC_GA4_ID ?? "",
  },
  verification: {
    /** Google Search Console: <meta name="google-site-verification" content="여기 값"> */
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
    /** Bing 웹마스터 도구: <meta name="msvalidate.01" content="여기 값"> */
    bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ?? "",
    /** 네이버 서치어드바이저: <meta name="naver-site-verification" content="여기 값"> */
    naver: process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION ?? "",
  },
} as const;

// ── 파생 값 (직접 수정하지 마세요) ─────────────────────────
export const telHref = `tel:${site.phone.display}`;
export const fullAddress = `${site.address.region} ${site.address.locality} ${site.address.street}`;
export const shortAddress = `대구 ${site.address.locality} ${site.address.street}`;
export const hoursText = site.hours.map((h) => `${h.days} ${h.opens}–${h.closes}`).join(", ");
export const clinicId = `${site.url}/#clinic`;
export const abs = (path: string) => `${site.url}${path}`;
