import type { MetadataRoute } from "next";

// 静的生成だと NEXT_PUBLIC_APP_URL がビルド時に baked される。Docker ビルド時に
// env が無いと localhost で固定化されるのを避けるため、runtime 評価する。
export const dynamic = "force-dynamic";

function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  if (!url) {
    // 本番でこのフォールバックに落ちると sitemap.xml が壊れる。Cloud Run の
    // env var が設定されているか必ず確認すること。
    console.warn("[sitemap] NEXT_PUBLIC_APP_URL not set; falling back to localhost");
    return "http://localhost:3000";
  }
  return url;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const now = new Date();

  return [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    {
      url: `${baseUrl}/simulator`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/learn/videos`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learn/blogs`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learn/mistakes`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
