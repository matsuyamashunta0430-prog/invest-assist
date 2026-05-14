import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { BLOGS } from "@/data/blogs";

export const metadata: Metadata = {
  title: "学べるブログ",
  description: "新NISA・インデックス投資の初心者向けブログ・解説サイト10本（URL検証済み）。",
};

export default function BlogsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        学べるブログ・解説サイト 10 選
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        公式 → インデックス基礎 → 失敗事例 → 長期実践記 の順で読むのがおすすめです。
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {BLOGS.map((b) => (
          <Card key={b.url}>
            <div className="text-xs font-semibold text-slate-500">{b.category}</div>
            <a
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-base font-bold text-slate-900 hover:underline"
            >
              {b.title}
            </a>
            <div className="mt-1 text-xs text-slate-500">{b.author}</div>
            <p className="mt-3 text-sm text-slate-700">{b.summary}</p>
            <p className="mt-2 text-sm text-emerald-700">なぜ初心者向き: {b.why}</p>
          </Card>
        ))}
      </div>
    </main>
  );
}
