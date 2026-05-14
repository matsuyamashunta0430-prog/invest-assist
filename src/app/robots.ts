import type { MetadataRoute } from "next";

// sitemap.ts と同様、env を runtime 評価するため動的にする。
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) {
    console.warn("[robots] NEXT_PUBLIC_APP_URL not set; falling back to localhost");
  }
  const resolved = baseUrl ?? "http://localhost:3000";

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${resolved}/sitemap.xml`,
  };
}
