/**
 * NISA 積立シミュレーション — 月次複利モデル（annuity ordinary / 期末払い）
 *
 * モデル:
 *   - 月初に初期投資額が入っている状態でスタート（month=0）
 *   - 各月の処理: 前月末評価額に月次利率を適用 → 当月積立額を投入
 *   - これは金融業界標準の "期末払い annuity"（楽天証券・SBI・金融庁シミュレーターと整合）
 *
 * 数式: FV = initial × (1+r)^n + monthly × ((1+r)^n - 1) / r
 *   r = annualRate / 100 / 12, n = months
 *
 * 実際の投信は基準価額変動なので近似値だが、初心者の目安として十分。
 */

export interface SimulationInput {
  /** 初期投資額（円）。0 以上 */
  initialAmount: number;
  /** 毎月積立額（円）。0 以上 */
  monthlyAmount: number;
  /** 年利（%）。例: 5.0 は年利 5%。マイナス可 */
  annualRate: number;
  /** 期間（月）。1 以上の整数 */
  months: number;
}

export interface SimulationPoint {
  /** 経過月（0 = 開始時点） */
  month: number;
  /** 元本累計（円） */
  principal: number;
  /** 評価額（円） */
  value: number;
  /** 利益（評価額 - 元本） */
  profit: number;
}

const MAX_MONTHS = 12 * 100; // 100年

function assertFinite(n: number, label: string): void {
  if (!Number.isFinite(n)) {
    throw new Error(`${label} must be a finite number, got ${n}`);
  }
}

export function validateInput(input: SimulationInput): void {
  assertFinite(input.initialAmount, "initialAmount");
  assertFinite(input.monthlyAmount, "monthlyAmount");
  assertFinite(input.annualRate, "annualRate");
  assertFinite(input.months, "months");

  if (input.initialAmount < 0) throw new Error("initialAmount must be >= 0");
  if (input.monthlyAmount < 0) throw new Error("monthlyAmount must be >= 0");
  if (!Number.isInteger(input.months)) throw new Error("months must be an integer");
  if (input.months < 0) throw new Error("months must be >= 0");
  if (input.months > MAX_MONTHS) throw new Error(`months must be <= ${MAX_MONTHS}`);
}

/**
 * 月次複利でシミュレーション実行（期末払い annuity ordinary）。
 * - 開始時点（month=0）: 元本=initialAmount, 評価額=initialAmount
 * - 各月の処理（month=1..months）:
 *     1) 前月末評価額に月次利率を適用（複利成長）
 *     2) その後に当月積立額 monthlyAmount を投入
 */
export function simulate(input: SimulationInput): readonly SimulationPoint[] {
  validateInput(input);

  const { initialAmount, monthlyAmount, annualRate, months } = input;
  const monthlyRate = annualRate / 1200; // = annualRate / 100 / 12

  const points: SimulationPoint[] = [
    {
      month: 0,
      principal: initialAmount,
      value: initialAmount,
      profit: 0,
    },
  ];

  let value = initialAmount;
  let principal = initialAmount;

  for (let m = 1; m <= months; m++) {
    // 1) 月末複利成長（前月末評価額に適用）
    value *= 1 + monthlyRate;
    // 2) 月末に当月積立を投入
    value += monthlyAmount;
    principal += monthlyAmount;
    points.push({
      month: m,
      principal,
      value,
      profit: value - principal,
    });
  }

  return points;
}

export interface SimulationSummary {
  finalValue: number;
  totalPrincipal: number;
  totalProfit: number;
  /** 利益率 = profit / principal × 100（principal=0 のときは 0） */
  profitRatePercent: number;
}

export function summarize(points: readonly SimulationPoint[]): SimulationSummary {
  const last = points.at(-1);
  if (!last) {
    throw new Error("summarize requires at least one simulation point");
  }
  const profitRatePercent = last.principal === 0 ? 0 : (last.profit / last.principal) * 100;
  return {
    finalValue: last.value,
    totalPrincipal: last.principal,
    totalProfit: last.profit,
    profitRatePercent,
  };
}

export interface Milestone {
  /** しきい値（円） */
  threshold: number;
  /** **最初に**しきい値に到達した月。負利率で再度割り込む可能性は考慮しない */
  month: number;
}

/**
 * 各しきい値について、利益が最初に到達した月を返す。
 * 達成しなかったしきい値は結果に含まれない。負利率時に再度割り込む可能性は考慮しない。
 */
export function findProfitMilestones(
  points: readonly SimulationPoint[],
  thresholds: readonly number[],
): Milestone[] {
  const sorted = [...thresholds].sort((a, b) => a - b);
  const milestones: Milestone[] = [];
  for (const threshold of sorted) {
    const hit = points.find((p) => p.profit >= threshold);
    if (hit) {
      milestones.push({ threshold, month: hit.month });
    }
  }
  return milestones;
}
