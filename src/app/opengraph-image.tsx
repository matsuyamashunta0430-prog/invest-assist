import { ImageResponse } from "next/og";

export const alt = "invest-assist — Beginner-friendly NISA savings simulator (Japanese)";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// next/og 内部の Satori は TTF/OTF のみ対応で、Google Fonts/Bunny からの
// woff2/eot は弾かれる（本番ログで確認済み）。CJK フォントを安定供給する
// 仕組みは別途必要なため、本 OG 画像は当面 Latin のみで運用し、
// 日本語版 OG 画像は別 Issue で対応する。
// Windows ローカルでの @vercel/og prerender バグ回避と Linux ランタイムでの
// 単純化のため動的生成のまま維持（コスト軽微）。
export const dynamic = "force-dynamic";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        color: "white",
        padding: "80px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 32, opacity: 0.75, letterSpacing: "0.05em" }}>invest-assist</div>
      <div
        style={{
          fontSize: 84,
          fontWeight: 800,
          lineHeight: 1.05,
          marginTop: 16,
          letterSpacing: "-0.02em",
        }}
      >
        NISA Savings
      </div>
      <div
        style={{
          fontSize: 84,
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          color: "#86efac",
        }}
      >
        Simulator
      </div>
      <div
        style={{
          fontSize: 32,
          marginTop: 36,
          opacity: 0.8,
          lineHeight: 1.4,
        }}
      >
        See how your monthly savings grow.
      </div>
      <div style={{ display: "flex", marginTop: 48, fontSize: 22, opacity: 0.6, gap: 24 }}>
        <span>Simulator</span>
        <span>·</span>
        <span>20 curated resources</span>
        <span>·</span>
        <span>Free</span>
      </div>
    </div>,
    { ...size },
  );
}
