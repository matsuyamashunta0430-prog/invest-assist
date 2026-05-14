"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  // global-error.tsx は root layout もエラーに巻き込まれた最後の砦のため、
  // 独自の <html>/<body> を持ち、外部依存（フォント・コンポーネント）を最小化する
  return (
    <html lang="ja">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#0f172a",
          background: "#ffffff",
        }}
      >
        <main
          style={{
            maxWidth: "640px",
            margin: "0 auto",
            padding: "80px 16px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 48, color: "#cbd5e1", margin: 0 }}>⚠</p>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginTop: 16 }}>
            致命的なエラーが発生しました
          </h1>
          <p style={{ marginTop: 12, color: "#475569" }}>
            ページを再読み込みしてください。問題が続く場合は時間をおいてから再度アクセスをお願いします。
          </p>
          {error.digest ? (
            <p
              style={{
                marginTop: 8,
                fontFamily: "monospace",
                fontSize: 12,
                color: "#94a3b8",
              }}
            >
              エラーID: {error.digest}
            </p>
          ) : null}
          <button
            onClick={reset}
            style={{
              marginTop: 32,
              padding: "12px 24px",
              fontSize: 14,
              fontWeight: 600,
              color: "white",
              background: "#0f172a",
              border: "none",
              borderRadius: 12,
              cursor: "pointer",
            }}
          >
            再試行
          </button>
        </main>
      </body>
    </html>
  );
}
