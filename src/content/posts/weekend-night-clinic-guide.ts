import { site, shortAddress } from "@/config/site";
import type { Post } from "../types";

const [weekday, weekend] = site.hours;

export const post: Post = {
  slug: "weekend-night-clinic-guide",
  title: "대구 성서 일요일·야간 진료 한의원 이용 안내",
  description: `${site.name}의 평일 야간, 토·일·공휴일 진료시간과 주차, 버스·지하철 오시는 길을 정리했습니다. 점심시간 없이 365일 진료합니다.`,
  category: "이용 안내",
  published: "2026-10-08",
  sections: [
    {
      question: `${site.name}은 일요일과 공휴일에도 진료하나요?`,
      answer: `네. ${weekend.days} 모두 ${weekend.opens}부터 ${weekend.closes}까지 진료합니다. 설·추석 연휴 진료 여부는 전화로 확인해 주세요.`,
      detail: [
        {
          type: "table",
          caption: `${site.name} 진료시간`,
          rows: [...site.hours.map((h) => [`${h.days}`, `${h.opens} – ${h.closes}`] as [string, string]), ["점심시간", site.lunchBreak]],
        },
      ],
    },
    {
      question: `${site.name}은 평일 몇 시까지 진료하나요?`,
      answer: `${weekday.days} 매일 ${weekday.closes}까지 진료합니다. 퇴근 후에도 오실 수 있도록 매일 야간진료를 합니다.`,
      detail: [{ type: "p", text: `한의사 ${site.doctorCount}명이 요일·시간대별로 나누어 진료해 점심시간 없이 진료할 수 있습니다.` }],
    },
    {
      question: `${site.name} 주차는 어디에 하나요?`,
      answer: `건물에 ${site.parking}이 가능합니다. ${site.parkingDetail}`,
      detail: [{ type: "p", text: `주소는 ${shortAddress}(${site.address.landmark})입니다.` }],
    },
    {
      question: `${site.name}에 버스·지하철로는 어떻게 가나요?`,
      answer: `버스는 ${site.transit.bus}입니다. 지하철은 ${site.transit.subway}입니다.`,
      detail: [{ type: "p", text: "건물에 도착하면 엘리베이터로 2층에 오시면 됩니다." }],
    },
  ],
  faqs: [
    { q: `${site.name}은 예약 없이 가도 되나요?`, a: `전화(${site.phone.display})로 예약하시면 기다리는 시간을 줄일 수 있습니다. 오시기 전 대기 상황도 전화로 안내해 드립니다.` },
    { q: "한의원에 처음 갈 때 무엇을 챙겨야 하나요?", a: "신분증을 챙겨 주세요. 복용 중인 약이 있거나 다른 병원 검사 결과가 있다면 함께 가져오시면 진료에 도움이 됩니다." },
    { q: `${site.name}은 점심시간에도 진료하나요?`, a: "네. 점심시간 없이 계속 진료합니다." },
    { q: "설날이나 추석 연휴에도 진료하나요?", a: `연휴 진료 일정은 해마다 다를 수 있으니 전화(${site.phone.display})로 확인해 주세요.` },
    { q: `${site.name}은 몇 층에 있나요?`, a: `${site.address.landmark}에 있습니다. 엘리베이터로 올라오시면 됩니다.` },
  ],
  source: "src/content/posts/weekend-night-clinic-guide.ts",
};
