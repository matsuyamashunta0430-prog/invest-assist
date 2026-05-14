import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Windows のシンボリックリンク権限問題を回避するため、Docker ビルド時のみ standalone を有効化
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,
  reactStrictMode: true,
  poweredByHeader: false,
  // typedRoutes は全ルート実装完了後に有効化する
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
