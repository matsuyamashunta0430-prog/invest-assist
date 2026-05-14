import { describe, expect, it } from "vitest";
import { fromSearchParams, simulatorInputSchema, toQueryString, toSimulationInput } from "./schema";

describe("simulatorInputSchema", () => {
  it("applies defaults when fields are missing", () => {
    const parsed = simulatorInputSchema.parse({});
    expect(parsed).toEqual({ initial: 0, monthly: 30_000, rate: 5, years: 20 });
  });

  it("coerces strings to numbers", () => {
    const parsed = simulatorInputSchema.parse({
      initial: "100000",
      monthly: "50000",
      rate: "7.5",
      years: "30",
    });
    expect(parsed).toEqual({ initial: 100_000, monthly: 50_000, rate: 7.5, years: 30 });
  });

  it("rejects negative values", () => {
    expect(() => simulatorInputSchema.parse({ monthly: -1 })).toThrow();
  });

  it("rejects rate over 30", () => {
    expect(() => simulatorInputSchema.parse({ rate: 31 })).toThrow();
  });

  it("rejects non-integer years", () => {
    expect(() => simulatorInputSchema.parse({ years: 1.5 })).toThrow();
  });
});

describe("toSimulationInput", () => {
  it("converts years → months", () => {
    const result = toSimulationInput({ initial: 0, monthly: 30_000, rate: 5, years: 20 });
    expect(result).toEqual({
      initialAmount: 0,
      monthlyAmount: 30_000,
      annualRate: 5,
      months: 240,
    });
  });
});

describe("toQueryString / fromSearchParams round-trip", () => {
  it("survives a round-trip with URLSearchParams", () => {
    const original = { initial: 100_000, monthly: 50_000, rate: 7, years: 25 };
    const qs = toQueryString(original);
    const parsed = fromSearchParams(new URLSearchParams(qs));
    expect(parsed).toEqual(original);
  });

  it("works with a plain Record", () => {
    const parsed = fromSearchParams({
      initial: "0",
      monthly: "10000",
      rate: "3",
      years: "10",
    });
    expect(parsed).toEqual({ initial: 0, monthly: 10_000, rate: 3, years: 10 });
  });

  it("falls back to defaults for missing keys", () => {
    const parsed = fromSearchParams(new URLSearchParams("monthly=20000"));
    expect(parsed.monthly).toBe(20_000);
    expect(parsed.initial).toBe(0);
    expect(parsed.rate).toBe(5);
    expect(parsed.years).toBe(20);
  });

  it("falls back to defaults on invalid input instead of throwing", () => {
    // ?rate=999 のような攻撃クエリでも throw せず安全にデフォルトへ
    const parsed = fromSearchParams(new URLSearchParams("rate=999&years=abc"));
    expect(parsed).toEqual({ initial: 0, monthly: 30_000, rate: 5, years: 20 });
  });

  it("treats empty string as default (not 0)", () => {
    const parsed = fromSearchParams(new URLSearchParams("monthly="));
    expect(parsed.monthly).toBe(30_000);
  });
});
