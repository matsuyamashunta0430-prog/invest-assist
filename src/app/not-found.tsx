import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "404 - ページが見つかりません",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-20 text-center">
      <p className="text-7xl font-bold tracking-tight text-slate-200 sm:text-8xl">404</p>
      <h1 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">ページが見つかりません</h1>
      <p className="mt-3 text-sm text-slate-600">
        URL が間違っているか、ページが移動・削除された可能性があります。
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/">
          <Button>トップへ戻る</Button>
        </Link>
        <Link href="/simulator">
          <Button variant="secondary">シミュレーターを試す</Button>
        </Link>
      </div>
    </main>
  );
}
