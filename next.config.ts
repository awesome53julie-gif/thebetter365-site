import type { NextConfig } from "next";

// 정적 사이트 생성(SSG): `npm run build` 결과가 out/ 폴더에 순수 HTML로 만들어집니다.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true, // /treatments/chuna/ → out/treatments/chuna/index.html (어느 호스팅에서도 열림)
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
