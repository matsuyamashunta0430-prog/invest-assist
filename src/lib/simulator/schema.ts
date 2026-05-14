import { z } from "zod";
import type { SimulationInput } from "./calculate";

/**
 * シミュレーター入力スキーマ。フォーム入力／URL クエリ両方で利用。
 */
export const simulatorInputSchema = z.object({
  /** 初期投資額（円） */
  initial: z.coerce.number().int().min(0).max(1_000_000_000).default(0),
  /** 毎月積立額（円） */
  monthly: z.coerce.number().int().min(0).max(1_000_000).default(30_000),
  /** 年利（%）— マイナスは UI で許可しない */
  rate: z.coerce.number().min(0).max(30).default(5),
  /** 期間（年） */
  years: z.coerce.number().int().min(1).max(50).default(20),
});

export type SimulatorInputForm = z.infer<typeof simulatorInputSchema>;

export function toSimulationInput(form: SimulatorInputForm): SimulationInput {
  return {
    initialAmount: form.initial,
    monthlyAmount: form.monthly,
    annualRate: form.rate,
    months: form.years * 12,
  };
}

/**
 * URL クエリ ↔ フォーム値 のシリアライズ。
 * 例: ?initial=0&monthly=30000&rate=5&years=20
 */
export function toQueryString(form: SimulatorInputForm): string {
  const params = new URLSearchParams({
    initial: String(form.initial),
    monthly: String(form.monthly),
    rate: String(form.rate),
    years: String(form.years),
  });
  return params.toString();
}

export function fromSearchParams(
  searchParams: URLSearchParams | Record<string, string | undefined>,
): SimulatorInputForm {
  const get = (key: string): string | undefined => {
    if (searchParams instanceof URLSearchParams) return searchParams.get(key) ?? undefined;
    return searchParams[key];
  };
  return simulatorInputSchema.parse({
    initial: get("initial"),
    monthly: get("monthly"),
    rate: get("rate"),
    years: get("years"),
  });
}
