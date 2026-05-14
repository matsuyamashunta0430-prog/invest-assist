import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About / 免責事項",
  description: "invest-assist の目的と免責事項。",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">About / 免責事項</h1>

      <section className="mt-8 space-y-4 text-sm text-slate-700">
        <p>
          <strong>invest-assist</strong>{" "}
          は、投資未経験〜初心者の方が新NISAやインデックス投資を「正しい順番で」学び、最初の一歩を踏み出すためのアシストツールです。
        </p>
        <p>
          シミュレーターは月次複利・期末払いモデルに基づく一般的な参考計算を行います。
          実際の投資信託や ETF
          は基準価額の変動・手数料・税金などの要因で結果が異なります。表示される数値は
          <strong>未来の運用成果を保証するものではありません</strong>。
        </p>
      </section>

      <h2 className="mt-12 text-lg font-bold">免責事項</h2>
      <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-slate-700">
        <li>
          本サイトは一般的な情報提供のみを目的とし、特定の銘柄・取引の推奨や投資助言ではありません。
        </li>
        <li>
          本サイトの情報を利用して行った投資判断の結果について、運営者は一切の責任を負いません。
        </li>
        <li>実際の投資にあたっては、金融商品取引業者の交付する目論見書を必ず確認してください。</li>
        <li>外部リンク先の内容については、それぞれの運営者の責任となります。</li>
      </ul>

      <h2 className="mt-12 text-lg font-bold">問い合わせ</h2>
      <p className="mt-4 text-sm text-slate-700">
        ご意見・不具合報告は GitHub Issues までお願いします（リポジトリ準備中）。
      </p>
    </main>
  );
}
