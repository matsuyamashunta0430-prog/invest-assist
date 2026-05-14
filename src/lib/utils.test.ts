import { describe, expect, it } from "vitest";
import { cn, formatJPY, formatNumber, formatPercent } from "./utils";

describe("cn", () => {
  it("merges tailwind classes", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("ignores falsy values", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });
});

describe("formatJPY", () => {
  it("formats positive integers", () => {
    expect(formatJPY(1_234_567)).toMatch(/￥|¥/);
    expect(formatJPY(1_234_567)).toContain("1,234,567");
  });

  it("rounds floats", () => {
    expect(formatJPY(1.4)).toContain("1");
    expect(formatJPY(1.5)).toContain("2");
  });

  it("handles zero and negatives", () => {
    expect(formatJPY(0)).toContain("0");
    expect(formatJPY(-100)).toContain("100");
  });
});

describe("formatPercent", () => {
  it("formats with 1 decimal by default", () => {
    expect(formatPercent(5.0)).toBe("5.0%");
    expect(formatPercent(7.55)).toBe("7.6%");
  });

  it("respects fractionDigits override", () => {
    expect(formatPercent(3.14159, 2)).toBe("3.14%");
  });
});

describe("formatNumber", () => {
  it("groups thousands", () => {
    expect(formatNumber(1_234_567)).toBe("1,234,567");
  });
});
