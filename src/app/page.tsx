import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "新NISA積立シミュレーター",
    desc: "月額・利回り・期間から将来資産を即座に可視化。URLでシェアもできます。",
    href: "/simulator",
    cta: "試す",
    available: true,
  },
  {
    title: "学べる動画とブログ",
    desc: "厳選された日本語の学習コンテンツ20本を、最適な順番で学べます。",
    href: "/learn/videos",
    cta: "学ぶ",
    available: true,
  },
  {
    title: "銘柄スクリーニング（準備中）",
    desc: "PER・自己資本比率・連続増配年数などの条件で日本株を絞り込み。フェーズ2で公開予定。",
    href: "/about",
    cta: "詳細",
    available: false,
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:py-20">
      <section className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          投資初心者のための、
          <br className="sm:hidden" />
          やさしい新NISAシミュレーター
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
          毎月いくら積み立てれば将来いくらになるか。スライダーを動かすだけで一目で分かります。
          学習動画・ブログも厳選 20 本をまとめました。
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/simulator">
            <Button size="lg">シミュレーターを試す</Button>
          </Link>
          <Link href="/learn/videos">
            <Button variant="secondary" size="lg">
              まず学ぶ
            </Button>
          </Link>
        </div>
      </section>

      <section className="mt-14 grid gap-4 sm:mt-20 sm:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title}>
            <h2 className="text-lg font-bold">{f.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
            <div className="mt-4">
              <Link href={f.href}>
                <Button variant={f.available ? "primary" : "secondary"} size="sm">
                  {f.cta}
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </section>

      <p className="mt-16 text-center text-xs text-slate-500">
        ※ 本サイトは一般的な情報提供のみを目的としており、投資助言ではありません。
      </p>
    </main>
  );
}
