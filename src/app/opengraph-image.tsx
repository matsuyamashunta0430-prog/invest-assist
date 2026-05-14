import { ImageResponse } from "next/og";

export const alt = "invest-assist — 投資初心者のための新NISA積立シミュレーター";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Windows ローカルビルドの @vercel/og フォントパス解決バグを回避し、
// Linux ランタイム（Cloud Run）で生成させる
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
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ fontSize: 28, opacity: 0.7, letterSpacing: "0.05em" }}>invest-assist</div>
      <div
        style={{
          fontSize: 72,
          fontWeight: 800,
          lineHeight: 1.1,
          marginTop: 12,
          letterSpacing: "-0.02em",
        }}
      >
        投資初心者のための、
      </div>
      <div
        style={{
          fontSize: 72,
          fontWeight: 800,
          lineHeight: 1.1,
          marginTop: 4,
          letterSpacing: "-0.02em",
          color: "#86efac",
        }}
      >
        新NISA積立シミュレーター
      </div>
      <div
        style={{
          fontSize: 30,
          marginTop: 32,
          opacity: 0.8,
          lineHeight: 1.4,
        }}
      >
        毎月いくら積み立てれば将来いくらになるか、
      </div>
      <div
        style={{
          fontSize: 30,
          opacity: 0.8,
          lineHeight: 1.4,
        }}
      >
        スライダーを動かすだけで一目で分かる。
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 48,
          fontSize: 22,
          opacity: 0.6,
          gap: 24,
        }}
      >
        <span>NISA積立シミュレーター</span>
        <span>·</span>
        <span>厳選コンテンツ20本</span>
        <span>·</span>
        <span>無料</span>
      </div>
    </div>,
    { ...size },
  );
}
