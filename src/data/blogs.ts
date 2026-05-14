export interface Blog {
  title: string;
  author: string;
  url: string;
  summary: string;
  why: string;
  category: "公式・制度" | "インデックス基礎" | "失敗事例" | "長期実践記";
}

export const BLOGS: readonly Blog[] = [
  {
    title: "NISA特設ウェブサイト",
    author: "金融庁",
    url: "https://www.fsa.go.jp/policy/nisa2/",
    summary: "新NISA制度の公式ポータル。シミュレーター・動画・PDF。",
    why: "政府公式の一次情報源。",
    category: "公式・制度",
  },
  {
    title: "NISA／新NISA",
    author: "楽天証券",
    url: "https://www.rakuten-sec.co.jp/web/nisa/",
    summary: "つみたて投資枠・成長投資枠、年間360万・生涯1800万の解説。",
    why: "図解と用語解説が豊富で初心者でも進めやすい。",
    category: "公式・制度",
  },
  {
    title: "NISAやるならSBI証券",
    author: "SBI証券",
    url: "https://go.sbisec.co.jp/lp/lp_nisa_230803.html",
    summary: "新NISA 活用法。投信マイレージやクレカ積立も掲載。",
    why: "業界最大手の実務解説（ポイント還元まで）。",
    category: "公式・制度",
  },
  {
    title: "投資信託クリニック",
    author: "カン・チュンド",
    url: "https://toshin-clinic.com/blog/",
    summary: "インデックス投資全般、NISA活用、リバランス戦略。",
    why: "教育的な記事が中心で腰を据えて学べる。",
    category: "インデックス基礎",
  },
  {
    title: "Dr.ちゅり男のインデックス投資",
    author: "ちゅり男（現役医師）",
    url: "https://www.churio807.com/",
    summary: "新NISA とインデックス投資をやさしく解説。",
    why: "「初心者ほどオルカン・S&P500」など指針が明快。",
    category: "インデックス基礎",
  },
  {
    title: "新NISAでよくある3つの失敗例と対処法",
    author: "ダイヤモンドZAi／頼藤太希",
    url: "https://diamond.jp/zai/articles/-/1053118",
    summary: "暴落時のパニック売り、生活防衛資金不足、信託報酬の罠。",
    why: "「実質コスト」まで踏み込んだ良記事。",
    category: "失敗事例",
  },
  {
    title: "新NISAの失敗例5選",
    author: "オカネコマガジン",
    url: "https://okane-kenko.jp/media/nisa-failure/",
    summary: "高値一括投資、デイトレでの枠消費など具体例。",
    why: "金額付きの具体的な失敗シナリオでイメージしやすい。",
    category: "失敗事例",
  },
  {
    title: "つみたてNISAでよく起こる4つの失敗",
    author: "マネイロメディア",
    url: "https://moneiro.jp/media/article/tumitatenisa-failure",
    summary: "積立額設定ミス、価格変動への耐性不足など。",
    why: "毎月の積立金額をどう決めるかに直接答える。",
    category: "失敗事例",
  },
  {
    title: "梅屋敷商店街のランダム・ウォーカー",
    author: "水瀬ケンイチ",
    url: "https://randomwalker.blog.fc2.com/",
    summary: "2005年から続くインデックス投資実践記。",
    why: "20年以上の実践記録で「退屈な投資が最強」を体得。",
    category: "長期実践記",
  },
  {
    title: "2008年からの資産運用の旅",
    author: "nantes（40代会社員）",
    url: "https://nantes20xx.com/",
    summary: "リーマン前後から続く月次レポート型ブログ。",
    why: "暴落も経験した会社員のリアルな運用成績。",
    category: "長期実践記",
  },
];
