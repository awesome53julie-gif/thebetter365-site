import type { Block, QaSection } from "@/content/types";

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return <p key={i}>{b.text}</p>;
          case "list": {
            const L = b.ordered ? "ol" : "ul";
            return (
              <L key={i}>
                {b.items.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </L>
            );
          }
          case "items":
            return (
              <div className="items" key={i}>
                {b.items.map((x) => (
                  <div className="item" key={x.title}>
                    <h3>{x.title}</h3>
                    <p>{x.text}</p>
                  </div>
                ))}
              </div>
            );
          case "table":
            return (
              <div className="table-wrap" key={i}>
                <table className="info-table">
                  <caption>{b.caption}</caption>
                  <tbody>
                    {b.rows.map(([k, v]) => (
                      <tr key={k}>
                        <th scope="row">{k}</th>
                        <td>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </>
  );
}

/** 질문형 H2 → 즉답(2~3문장) → 상세설명 */
export function QaSections({ sections }: { sections: QaSection[] }) {
  return (
    <>
      {sections.map((s) => (
        <section className="qa" key={s.question}>
          <h2>{s.question}</h2>
          <p className="answer">{s.answer}</p>
          <div className="detail">
            <Blocks blocks={s.detail} />
          </div>
        </section>
      ))}
    </>
  );
}
