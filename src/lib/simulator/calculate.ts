/**
 * NISA 積立シミュレーション — 月次複利モデル
 *
 * 月初に積立額を投入し、月末に月次利率で複利成長する単純化モデル。
 * 実際の投資信託の基準価額変動とは異なるが、初心者の目安として十分な精度。
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
 * 月次複利でシミュレーション実行。
 * - 開始時点（month=0）: 元本=initialAmount, 評価額=initialAmount
 * - 各月（month=1..months）: 月初に monthlyAmount を投入し、月末に月次利率を適用
 */
export function simulate(input: SimulationInput): SimulationPoint[] {
  validateInput(input);

  const { initialAmount, monthlyAmount, annualRate, months } = input;
  const monthlyRate = annualRate / 100 / 12;

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
    // 月初に積立
    value += monthlyAmount;
    principal += monthlyAmount;
    // 月末に複利成長
    value *= 1 + monthlyRate;
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

export function summarize(points: SimulationPoint[]): SimulationSummary {
  const last = points.at(-1);
  if (!last) {
    return { finalValue: 0, totalPrincipal: 0, totalProfit: 0, profitRatePercent: 0 };
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
  /** 達成した利益額（円） */
  profit: number;
  /** 達成月（経過月） */
  month: number;
}

/**
 * 与えられた利益額しきい値の達成月を返す。
 * 達成しなかったしきい値は結果に含まれない。
 */
export function findProfitMilestones(
  points: SimulationPoint[],
  thresholds: readonly number[],
): Milestone[] {
  const milestones: Milestone[] = [];
  for (const threshold of thresholds) {
    const hit = points.find((p) => p.profit >= threshold);
    if (hit) {
      milestones.push({ profit: threshold, month: hit.month });
    }
  }
  return milestones;
}
