import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // 리액트 엄격 모드 활성화
  reactStrictMode: true,

  // TypeScript 설정
  typescript: {
    // 빌드 시, 타입 검사 결과 무시 설정
    // ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      // 보안 허용 목록
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "irtewydhcemzivfwwhdu.supabase.co", // 신뢰할 수 있는 소스에서만 이미지를 가져올 수 있도록 설정
        port: "",
        pathname: "/storage/v1/object/public/**", // 위 저장소의 데이터에만 접근할 수 있도록 범위를 좁혀서 보안성을 높임
      },
      {
        protocol: "https",
        hostname: "image.aladin.co.kr",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
  },
}

export default nextConfig
