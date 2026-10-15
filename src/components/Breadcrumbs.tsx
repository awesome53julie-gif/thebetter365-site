import Link from "next/link";

export function Breadcrumbs({ items }: { items: [string, string][] }) {
  return (
    <nav className="crumb" aria-label="현재 위치">
      <ol>
        {items.map(([name, href], i) => (
          <li key={href}>{i < items.length - 1 ? <Link href={href}>{name}</Link> : <span aria-current="page">{name}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}
