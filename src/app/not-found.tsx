import Link from "next/link";

export default function NotFound() {
  return (
    <header className="page-hero">
      <div className="wrap narrow">
        <h1>페이지를 찾을 수 없습니다</h1>
        <p className="lead">주소가 바뀌었거나 없는 페이지입니다.</p>
        <p>
          <Link className="btn primary" href="/">처음으로</Link>
        </p>
      </div>
    </header>
  );
}
