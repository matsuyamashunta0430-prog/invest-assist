import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        投資初心者のための、
        <br />
        やさしい新NISAシミュレーター
      </h1>
      <p className="mt-4 text-base text-gray-600">
        毎月いくら積み立てれば将来いくらになるか。スライダーを動かすだけで一目で分かります。
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/simulator"
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          シミュレーターを試す
        </Link>
        <Link
          href="/learn/videos"
          className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          まず学ぶ
        </Link>
      </div>
      <p className="mt-12 text-xs text-gray-500">
        ※ 本サイトは一般的な情報提供のみを目的としており、投資助言ではありません。
      </p>
    </main>
  );
}
