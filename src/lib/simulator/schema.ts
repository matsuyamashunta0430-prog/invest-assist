import { z } from "zod";
import type { SimulationInput } from "./calculate";

/**
 * 空文字列／null／undefined を一律 undefined に正規化してから数値 coerce する。
 * Zod の `default()` は undefined にしか反応しないため、空クエリ `?monthly=` で
 * 黙って 0 になる罠を避ける。
 */
const numericInput = (defaultValue: number) =>
  z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z.coerce.number().refine(Number.isFinite, "must be a finite number").default(defaultValue),
  );

/**
 * シミュレーター入力スキーマ。フォーム入力／URL クエリ両方で利用。
 * UI は正利率のみ受け付ける（負利率は将来「下落シナリオ」機能で別スキーマを用意）。
 */
export const simulatorInputSchema = z.object({
  /** 初期投資額（円） */
  initial: numericInput(0).pipe(z.number().int().min(0).max(1_000_000_000)),
  /** 毎月積立額（円） */
  monthly: numericInput(30_000).pipe(z.number().int().min(0).max(1_000_000)),
  /** 年利（%）— UI では負利率を許可しない */
  rate: numericInput(5).pipe(z.number().min(0).max(30)),
  /** 期間（年） */
  years: numericInput(20).pipe(z.number().int().min(1).max(50)),
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

/**
 * URL クエリから入力値を取り出す。
 * **不正値はデフォルトにフォールバック**（throw しない）— URL は外部入力で 500 を避けるため。
 */
export function fromSearchParams(
  searchParams: URLSearchParams | Record<string, string | undefined>,
): SimulatorInputForm {
  const get = (key: string): string | undefined => {
    if (searchParams instanceof URLSearchParams) return searchParams.get(key) ?? undefined;
    return searchParams[key];
  };
  const raw = {
    initial: get("initial"),
    monthly: get("monthly"),
    rate: get("rate"),
    years: get("years"),
  };
  const result = simulatorInputSchema.safeParse(raw);
  if (result.success) return result.data;
  // 不正値があったら全体をデフォルトに落とす（最も予測可能な挙動）
  return simulatorInputSchema.parse({});
}
