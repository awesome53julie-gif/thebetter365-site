/** 본문 블록. 글자는 모두 HTML 텍스트로 출력됩니다(이미지 속 글자 금지). */
export type Block =
  | { type: "p"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "items"; items: { title: string; text: string }[] } // 소제목(h3) + 설명
  | { type: "table"; caption: string; rows: [string, string][] };

/** 질문형 H2 → 2~3문장 즉답 → 상세설명 */
export type QaSection = {
  /** 환자가 실제로 묻는 질문 (물음표로 끝남) */
  question: `${string}?`;
  /** 2~3문장 즉답. 검사 스크립트가 문장 수를 확인합니다. */
  answer: string;
  detail: Block[];
};

export type Faq = { q: `${string}?`; a: string };
/** FAQ는 정확히 5개 */
export type Faqs = [Faq, Faq, Faq, Faq, Faq];

export type Img = { src: string; alt: string; width: number; height: number };

export type Treatment = {
  slug: string;
  /** 메뉴·카드에 쓰는 짧은 이름 */
  name: string;
  /** 검색 결과 제목 */
  title: string;
  description: string;
  /** 페이지 첫 문단: 이 진료가 무엇인지 한 번에 */
  lead: string;
  tags: string[];
  image: Img;
  icon: Img;
  /** 구조화 데이터 about 유형 */
  about: { type: "MedicalCondition" | "MedicalTherapy"; name: string };
  sections: QaSection[];
  faqs: Faqs;
  /** 실제 수정일 계산용: 이 원고 파일 경로 */
  source: string;
};

export type Post = {
  slug: string;
  title: string;
  description: string;
  category: string;
  /** 처음 게시한 날 (YYYY-MM-DD). 수정일은 git 커밋 날짜로 자동 계산 */
  published: string;
  /** 글쓴이·검수자 (의료진 이름이면 의사 정보와 연결) */
  author?: string;
  reviewedBy?: string;
  relatedTreatment?: string;
  sections: QaSection[];
  faqs: Faqs;
  source: string;
};
