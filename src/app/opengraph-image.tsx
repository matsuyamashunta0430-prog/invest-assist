import { ImageResponse } from "next/og";

export const alt = "invest-assist — 投資初心者のための新NISA積立シミュレーター";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// next/og のデフォルトフォントは Latin のみで CJK 豆腐化する。日本語フォントを実行時に
// fetch する都合で force-dynamic にする（Cloud Run でリクエスト毎生成）。
// OG 画像のヒット数は SNS ボット中心で多くないため、コスト影響は無視できる程度。
// Codex C1 / H1 のトレードオフを承知の上で本設定を採用。
export const dynamic = "force-dynamic";

async function loadNotoSansJP(weight: 700 | 400): Promise<ArrayBuffer> {
  const cssRes = await fetch(
    `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@${weight}`,
    { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } },
  );
  if (!cssRes.ok) throw new Error(`Google Fonts CSS fetch failed: ${cssRes.status}`);
  const css = await cssRes.text();
  const match = css.match(/url\((https:\/\/[^)]+)\)\s*format\('woff2'\)/);
  if (!match || !match[1]) throw new Error("Could not extract woff2 URL from Google Fonts CSS");
  const fontRes = await fetch(match[1]);
  if (!fontRes.ok) throw new Error(`Font woff2 fetch failed: ${fontRes.status}`);
  return fontRes.arrayBuffer();
}

export default async function OpengraphImage() {
  const [jpBold, jpRegular] = await Promise.all([loadNotoSansJP(700), loadNotoSansJP(400)]);

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
        fontFamily: "NotoSansJP",
      }}
    >
      <div style={{ fontSize: 28, opacity: 0.7, letterSpacing: "0.05em" }}>invest-assist</div>
      <div
        style={{
          fontSize: 72,
          fontWeight: 700,
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
          fontWeight: 700,
          lineHeight: 1.1,
          marginTop: 4,
          letterSpacing: "-0.02em",
          color: "#86efac",
        }}
      >
        新NISA積立シミュレーター
      </div>
      <div style={{ fontSize: 30, marginTop: 32, opacity: 0.8, lineHeight: 1.4 }}>
        毎月いくら積み立てれば将来いくらになるか、
      </div>
      <div style={{ fontSize: 30, opacity: 0.8, lineHeight: 1.4 }}>
        スライダーを動かすだけで一目で分かる。
      </div>
      <div style={{ display: "flex", marginTop: 48, fontSize: 22, opacity: 0.6, gap: 24 }}>
        <span>NISA積立シミュレーター</span>
        <span>·</span>
        <span>厳選コンテンツ20本</span>
        <span>·</span>
        <span>無料</span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "NotoSansJP", data: jpBold, weight: 700, style: "normal" },
        { name: "NotoSansJP", data: jpRegular, weight: 400, style: "normal" },
      ],
    },
  );
}
