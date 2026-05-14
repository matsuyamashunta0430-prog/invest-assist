import { describe, expect, it } from "vitest";
import {
  findProfitMilestones,
  simulate,
  summarize,
  validateInput,
  type SimulationInput,
} from "./calculate";

const base: SimulationInput = {
  initialAmount: 0,
  monthlyAmount: 30_000,
  annualRate: 5,
  months: 12 * 20,
};

describe("validateInput", () => {
  it("accepts valid input", () => {
    expect(() => validateInput(base)).not.toThrow();
  });

  it("rejects negative initialAmount", () => {
    expect(() => validateInput({ ...base, initialAmount: -1 })).toThrow();
  });

  it("rejects negative monthlyAmount", () => {
    expect(() => validateInput({ ...base, monthlyAmount: -1 })).toThrow();
  });

  it("rejects non-integer months", () => {
    expect(() => validateInput({ ...base, months: 1.5 })).toThrow();
  });

  it("rejects negative months", () => {
    expect(() => validateInput({ ...base, months: -1 })).toThrow();
  });

  it("rejects NaN", () => {
    expect(() => validateInput({ ...base, annualRate: NaN })).toThrow();
  });

  it("rejects months over 100 years", () => {
    expect(() => validateInput({ ...base, months: 12 * 101 })).toThrow();
  });
});

describe("simulate", () => {
  it("returns initial point only when months=0", () => {
    const points = simulate({ ...base, months: 0, initialAmount: 100_000 });
    expect(points).toHaveLength(1);
    expect(points[0]).toEqual({ month: 0, principal: 100_000, value: 100_000, profit: 0 });
  });

  it("calculates simple accumulation at 0% rate", () => {
    const points = simulate({
      initialAmount: 0,
      monthlyAmount: 10_000,
      annualRate: 0,
      months: 12,
    });
    const last = points.at(-1)!;
    expect(last.principal).toBe(120_000);
    expect(last.value).toBe(120_000);
    expect(last.profit).toBe(0);
  });

  it("produces growth at positive rate matching annuity-ordinary formula", () => {
    const points = simulate(base);
    expect(points).toHaveLength(base.months + 1);
    const last = points.at(-1)!;
    // 期末払い annuity の理論値:
    //   FV = monthly × ((1+r)^n - 1) / r, r = 0.05/12, n = 240
    //   FV = 30000 × ((1.0041667)^240 - 1) / 0.0041667 ≈ 12,330,000 円
    // 楽天証券・SBI・金融庁シミュレーターと一致するレンジ
    expect(last.principal).toBe(7_200_000);
    expect(last.value).toBeCloseTo(12_330_000, -4); // ±5万円以内
    expect(last.profit).toBeGreaterThan(0);
  });

  it("handles negative rate as loss", () => {
    const points = simulate({ ...base, annualRate: -5, months: 60 });
    const last = points.at(-1)!;
    expect(last.value).toBeLessThan(last.principal);
    expect(last.profit).toBeLessThan(0);
  });

  it("compounds initial amount even with zero monthly", () => {
    const points = simulate({
      initialAmount: 1_000_000,
      monthlyAmount: 0,
      annualRate: 12, // 月利1%
      months: 12,
    });
    const last = points.at(-1)!;
    expect(last.principal).toBe(1_000_000);
    // (1.01)^12 ≈ 1.1268
    expect(last.value).toBeCloseTo(1_126_825, -3);
  });

  it("each step's profit equals value - principal", () => {
    const points = simulate(base);
    for (const p of points) {
      expect(p.profit).toBeCloseTo(p.value - p.principal, 6);
    }
  });
});

describe("summarize", () => {
  it("throws on empty points (caller bug)", () => {
    expect(() => summarize([])).toThrow(/at least one/);
  });

  it("computes profit rate", () => {
    const points = simulate(base);
    const s = summarize(points);
    expect(s.totalPrincipal).toBe(7_200_000);
    expect(s.finalValue).toBeGreaterThan(s.totalPrincipal);
    expect(s.profitRatePercent).toBeGreaterThan(0);
  });

  it("handles zero principal gracefully", () => {
    const s = summarize([{ month: 0, principal: 0, value: 0, profit: 0 }]);
    expect(s.profitRatePercent).toBe(0);
  });
});

describe("findProfitMilestones", () => {
  const ONE_OKU = 100_000_000;

  it("returns milestones in ascending threshold order, skipping unreached", () => {
    const points = simulate(base);
    const result = findProfitMilestones(points, [5_000_000, 1_000_000, ONE_OKU]);
    expect(result).toHaveLength(2); // 1億は届かない
    expect(result[0]!.threshold).toBe(1_000_000);
    expect(result[1]!.threshold).toBe(5_000_000);
    expect(result[0]!.month).toBeLessThan(result[1]!.month);
  });

  it("returns empty if no thresholds met", () => {
    const points = simulate({ ...base, months: 12, monthlyAmount: 1_000 });
    expect(findProfitMilestones(points, [ONE_OKU])).toEqual([]);
  });
});
