import type { Metadata } from "next";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "よくある失敗と対処法",
  description: "新NISA・インデックス投資の初心者がやりがちな失敗と回避策まとめ。",
};

const MISTAKES = [
  {
    title: "生活防衛資金がないまま全力投資",
    body: "突発的な出費で割高でも売却することに。月の生活費 6〜12 か月分は現金で確保してから始めましょう。",
  },
  {
    title: "暴落でパニック売り",
    body: "20〜30% 下落は数年に1度起こります。売らずに積立を続けたほうが結果的に多くの場合プラスになります。",
  },
  {
    title: "信託報酬の高い投信を選ぶ",
    body: "コストは確実に毎年マイナスです。eMAXIS Slim 系など信託報酬 0.1% 前後のインデックスを選びましょう。",
  },
  {
    title: "値動きの大きい商品で非課税枠を使い切る",
    body: "新NISA はデイトレ向けではありません。生涯1800万の非課税枠は長期インデックスのために使うのが効率的です。",
  },
  {
    title: "「次の銘柄」探しを繰り返す",
    body: "毎月コツコツが最強。米中株個別株や仕組み商品より、まずオルカン・S&P500 を続けることに集中しましょう。",
  },
] as const;

export default function MistakesPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">よくある失敗と対処法</h1>
      <p className="mt-2 text-sm text-slate-600">失敗を「知っているだけ」で 8 割は避けられます。</p>
      <div className="mt-8 space-y-4">
        {MISTAKES.map((m, i) => (
          <Card key={m.title}>
            <div className="text-xs font-semibold text-slate-500">No.{i + 1}</div>
            <h2 className="mt-1 text-lg font-bold">{m.title}</h2>
            <p className="mt-2 text-sm text-slate-700">{m.body}</p>
          </Card>
        ))}
      </div>
    </main>
  );
}
