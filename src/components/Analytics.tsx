import Script from "next/script";
import { site } from "@/config/site";

/** GA4: site.analytics.ga4Id 가 있을 때만 출력 */
export function Analytics() {
  const id = site.analytics.ga4Id;
  if (!id) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`}
      </Script>
    </>
  );
}
