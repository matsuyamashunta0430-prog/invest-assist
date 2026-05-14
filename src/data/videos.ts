export interface Video {
  title: string;
  channel: string;
  url: string;
  summary: string;
  why: string;
  category: "NISA基礎" | "インデックス基礎" | "失敗回避" | "英語補助";
}

export const VIDEOS: readonly Video[] = [
  {
    title: "【これ一本でわかる！】投資初心者でもスグに新NISAを始められる超入門動画！2025年版",
    channel: "バンクアカデミー",
    url: "https://www.youtube.com/watch?v=J7MqGeEJFoM",
    summary: "新NISA の仕組み・口座開設・銘柄選定を1本で完結。",
    why: "登録者80万人超の人気チャンネル。図解中心で迷わない。",
    category: "NISA基礎",
  },
  {
    title: "【超初心者向け】2024年からの新NISA制度のポイントを、投資経験ゼロでも分かるように",
    channel: "バンクアカデミー",
    url: "https://www.youtube.com/watch?v=FMsSLZkif4E",
    summary: "つみたて投資枠・成長投資枠・非課税保有限度額の全体像。",
    why: "制度の土台を最初に押さえるのに最適。",
    category: "NISA基礎",
  },
  {
    title: "【2025年からでも遅くない】新NISAのやさしい始め方を超初心者向けに解説",
    channel: "バンクアカデミー",
    url: "https://www.youtube.com/watch?v=O1q6xsWPAYE",
    summary: "銘柄選び・口座開設・積立設定を一気通貫で。",
    why: "2025年公開で情報が新しく、出遅れ感を解消。",
    category: "NISA基礎",
  },
  {
    title: "第235回 【歴史が変わる】新NISAのココがスゴイ5選",
    channel: "両学長 リベラルアーツ大学",
    url: "https://www.youtube.com/watch?v=mEQDotS9Bp8",
    summary: "旧 NISA との違いと優位性を5点に整理。",
    why: "アニメ解説で「なぜ新NISAを使うべきか」が腑に落ちる。",
    category: "NISA基礎",
  },
  {
    title: "S&P500とオルカンに半分ずつ投資はアリ？初心者向けにやさしく解説",
    channel: "バンクアカデミー",
    url: "https://www.youtube.com/watch?v=piEs3yFECZE",
    summary: "二大インデックスの違いと併用戦略の妥当性。",
    why: "最初の銘柄選定で迷う人に最適。",
    category: "インデックス基礎",
  },
  {
    title: "【実例5選】iDeCoとつみたてNISAの「次にやる投資」",
    channel: "両学長 リベラルアーツ大学",
    url: "https://www.youtube.com/watch?v=4EhTP9KdHc4",
    summary: "つみたて系を埋めた後の出口・追加戦略。",
    why: "長期視点が育ち、つみたて継続のモチベが上がる。",
    category: "インデックス基礎",
  },
  {
    title: "新NISAを始めた人が次にやる事はコレ！運用を長く続ける心構え",
    channel: "バンクアカデミー",
    url: "https://www.youtube.com/watch?v=UzJe0S8qK34",
    summary: "積立設定後の確認・調整、長期保有のメンタル管理。",
    why: "「設定して終わり」にしない運用習慣を学べる。",
    category: "インデックス基礎",
  },
  {
    title: "【知らないと致命傷】新NISAでよくある勘違い5選",
    channel: "バンクアカデミー",
    url: "https://www.youtube.com/watch?v=f9k9Fl0xRiE",
    summary: "非課税枠の復活時期、損益通算不可など落とし穴。",
    why: "開設前に必ず観るべき1本。",
    category: "失敗回避",
  },
  {
    title: "【大失敗】NISAを4年やって気付いた後悔&失敗！",
    channel: "個人投資家系チャンネル",
    url: "https://www.youtube.com/watch?v=EH5bj82uLec",
    summary: "実際に4年運用した投資家の失敗と回避策。",
    why: "実体験の「やらかし」は教科書より刺さる。",
    category: "失敗回避",
  },
  {
    title: "The Most Important Lessons in Investing",
    channel: "Ben Felix",
    url: "https://www.youtube.com/watch?v=MOjS2zuQMdo",
    summary: "CFA 保有者が学術的根拠からインデックス投資を解説。",
    why: "世界的に信頼される教育チャンネル。日本語自動字幕対応。",
    category: "英語補助",
  },
];
