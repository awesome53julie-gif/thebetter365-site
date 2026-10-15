import type { Faqs } from "@/content/types";

/** 자주 묻는 질문 5개. 답은 접혀 있어도 HTML에 들어 있습니다. */
export function FaqList({ topic, faqs }: { topic: string; faqs: Faqs }) {
  return (
    <section className="faq" id="faq">
      <h2>{topic} 자주 묻는 질문</h2>
      {faqs.map((f, i) => (
        <details key={f.q} open={i === 0}>
          <summary>
            <h3>{f.q}</h3>
          </summary>
          <p>{f.a}</p>
        </details>
      ))}
    </section>
  );
}
