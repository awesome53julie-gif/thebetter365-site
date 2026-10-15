import { site } from "@/config/site";

export function HoursTable() {
  return (
    <table className="info-table">
      <caption>{site.name} 진료시간</caption>
      <tbody>
        {site.hours.map((h) => (
          <tr key={h.label}>
            <th scope="row">{h.days}</th>
            <td>
              {h.opens} – {h.closes} <small>{h.note}</small>
            </td>
          </tr>
        ))}
        <tr>
          <th scope="row">점심시간</th>
          <td>{site.lunchBreak}</td>
        </tr>
      </tbody>
    </table>
  );
}
