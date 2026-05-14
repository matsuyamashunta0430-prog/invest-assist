"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 本番では Cloud Error Reporting が自動的にこの console.error を拾う
    console.error("App error:", error);
  }, [error]);

  return (
    <main className="mx-auto max-w-2xl px-4 py-20 text-center">
      <p className="text-6xl tracking-tight text-slate-200">⚠</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">問題が発生しました</h1>
      <p className="mt-3 text-sm text-slate-600">
        ご不便をおかけして申し訳ありません。お時間を置いて再度お試しください。
      </p>
      {error.digest ? (
        <p className="mt-2 font-mono text-xs text-slate-400">エラーID: {error.digest}</p>
      ) : null}
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>再試行</Button>
        <Link href="/">
          <Button variant="secondary">トップへ戻る</Button>
        </Link>
      </div>
    </main>
  );
}
