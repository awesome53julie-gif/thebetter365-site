import type { Img } from "./types";

export type Doctor = {
  /** 구조화 데이터 ID에 쓰는 영문 이름. 이름이 확인되지 않은 의료진은 null */
  id: string | null;
  name: string | null;
  role: string;
  photo: Img;
};

const photo = (file: string, alt: string): Img => ({ src: `/img/${file}`, alt, width: 900, height: 1125 });

export const doctors: Doctor[] = [
  { id: "yudeoksun", name: "유덕순", role: "대표원장", photo: photo("dr-yudeoksun.jpg", "더나은365한의원 대표원장 유덕순 한의사 프로필 사진, 흰 가운과 남색 넥타이 차림") },
  { id: "kimjebeom", name: "김제범", role: "한의사", photo: photo("dr-kimjebeom.jpg", "더나은365한의원 김제범 한의사 프로필 사진, 흰 가운 차림") },
  { id: "leedayoung", name: "이다영", role: "한의사", photo: photo("dr-leedayoung.jpg", "더나은365한의원 이다영 한의사 프로필 사진, 흰 가운 차림") },
  { id: "leesiwoo", name: "이시우", role: "한의사", photo: photo("dr-leesiwoo.jpg", "더나은365한의원 이시우 한의사 프로필 사진, 흰 가운 차림") },
  { id: "hwangtaehyung", name: "황태형", role: "한의사", photo: photo("dr-hwangtaehyung.jpg", "더나은365한의원 황태형 한의사 프로필 사진, 흰 가운 차림") },
  // TODO: 이름 확인 후 id·name을 채우면 의사 구조화 데이터에도 자동으로 들어갑니다.
  { id: null, name: null, role: "한의사", photo: photo("dr-a.jpg", "더나은365한의원 한의사 프로필 사진, 둥근 안경과 검정 넥타이 차림") },
  { id: null, name: null, role: "한의사", photo: photo("dr-b.jpg", "더나은365한의원 한의사 프로필 사진, 패턴 넥타이 차림") },
];

export const namedDoctors = doctors.filter((d): d is Doctor & { id: string; name: string } => !!d.id && !!d.name);
export const doctorById = (name: string) => namedDoctors.find((d) => d.name === name);
