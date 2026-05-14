import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { VIDEOS } from "@/data/videos";

export const metadata: Metadata = {
  title: "学べる動画",
  description: "新NISA・インデックス投資の初心者向け YouTube 動画10本（厳選・URL検証済み）。",
};

export default function VideosPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">学べる動画 10 選</h1>
      <p className="mt-2 text-sm text-slate-600">
        新NISA → インデックス基礎 → 失敗回避 の順に観ると効率的です。
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {VIDEOS.map((v) => (
          <Card key={v.url}>
            <div className="text-xs font-semibold text-slate-500">{v.category}</div>
            <a
              href={v.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-base font-bold text-slate-900 hover:underline"
            >
              {v.title}
            </a>
            <div className="mt-1 text-xs text-slate-500">{v.channel}</div>
            <p className="mt-3 text-sm text-slate-700">{v.summary}</p>
            <p className="mt-2 text-sm text-emerald-700">なぜ初心者向き: {v.why}</p>
          </Card>
        ))}
      </div>
    </main>
  );
}
