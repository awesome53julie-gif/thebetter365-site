import { site } from "@/config/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { pageMeta } from "@/lib/meta";

// TODO: 한의원에서 쓰는 정식 문서로 교체한 뒤 noindex를 지우세요.
export const metadata = pageMeta({ title: "개인정보 처리방침", description: `${site.name} 개인정보 처리방침`, path: "/privacy/", noindex: true });

export default function Page() {
  return (
    <header className="page-hero">
      <div className="wrap narrow">
        <Breadcrumbs items={[["홈", "/"], ["개인정보 처리방침", "/privacy/"]]} />
        <h1>개인정보 처리방침</h1>
        <p className="lead">정식 문서를 준비하고 있습니다. 문의는 전화 {site.phone.display}로 해 주세요.</p>
      </div>
    </header>
  );
}
