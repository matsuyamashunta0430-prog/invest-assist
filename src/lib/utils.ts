import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const JPY = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

export function formatJPY(value: number): string {
  return JPY.format(Math.round(value));
}

export function formatPercent(value: number, fractionDigits = 1): string {
  // toFixed は IEEE 754 の影響で 7.55 → "7.5" のような不安定な丸めをする。
  // Math.round + 10^n スケーリングで Half away from zero を担保する。
  const factor = 10 ** fractionDigits;
  const rounded = Math.round(value * factor) / factor;
  return `${rounded.toFixed(fractionDigits)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("ja-JP").format(Math.round(value));
}
