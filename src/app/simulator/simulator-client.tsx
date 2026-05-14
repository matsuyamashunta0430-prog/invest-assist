"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardLabel, CardValue } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  findProfitMilestones,
  simulate,
  summarize,
  type SimulationPoint,
} from "@/lib/simulator/calculate";
import {
  simulatorInputSchema,
  toQueryString,
  toSimulationInput,
  type SimulatorInputForm,
} from "@/lib/simulator/schema";
import { formatJPY, formatPercent } from "@/lib/utils";

interface Props {
  initial: SimulatorInputForm;
}

const MILESTONES = [1_000_000, 5_000_000, 10_000_000, 50_000_000];

function compactJPY(value: number): string {
  // 1000万以上は「億・万」表記、それ未満は通常通り
  const abs = Math.abs(value);
  if (abs >= 100_000_000) {
    const oku = value / 100_000_000;
    return `${oku.toFixed(2)}億円`;
  }
  if (abs >= 10_000) {
    const man = value / 10_000;
    return `${Math.round(man).toLocaleString("ja-JP")}万円`;
  }
  return formatJPY(value);
}

interface FieldProps {
  label: string;
  unit: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}

function Field({ label, unit, hint, value, min, max, step, onChange }: FieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <Label>{label}</Label>
        <div className="flex items-baseline gap-1">
          <Input
            type="number"
            value={Number.isFinite(value) ? value : ""}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === "") return onChange(min);
              const parsed = Number(raw);
              if (!Number.isFinite(parsed)) return;
              onChange(Math.min(max, Math.max(min, parsed)));
            }}
            className="h-9 w-28 text-right text-sm"
            aria-label={label}
          />
          <span className="text-sm text-slate-500">{unit}</span>
        </div>
      </div>
      <Slider value={value} min={min} max={max} step={step} onValueChange={onChange} />
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

export function SimulatorClient({ initial }: Props) {
  const [form, setForm] = useState<SimulatorInputForm>(initial);
  const [shareLabel, setShareLabel] = useState<string>("URLでシェア");

  const update = <K extends keyof SimulatorInputForm>(key: K, value: SimulatorInputForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const { summary, milestones, annualPoints } = useMemo(() => {
    const parsed = simulatorInputSchema.parse(form); // 防御的にもう一度バリデーション
    const sim = toSimulationInput(parsed);
    const ps = simulate(sim);
    return {
      summary: summarize(ps),
      milestones: findProfitMilestones(ps, MILESTONES),
      annualPoints: ps.filter((p) => p.month % 12 === 0),
    };
  }, [form]);

  const onShare = async () => {
    const url = `${window.location.origin}/simulator?${toQueryString(form)}`;
    window.history.replaceState(null, "", `?${toQueryString(form)}`);
    try {
      await navigator.clipboard.writeText(url);
      setShareLabel("URLをコピーしました ✓");
      setTimeout(() => setShareLabel("URLでシェア"), 2000);
    } catch {
      setShareLabel("クリップボード失敗");
      setTimeout(() => setShareLabel("URLでシェア"), 2000);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">新NISA積立シミュレーター</h1>
        <p className="mt-2 text-sm text-slate-600">
          毎月いくら積み立てるか、利回りは何%、何年続けるか。3つの数字で将来の資産がわかります。
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
        <Card className="space-y-6">
          <Field
            label="毎月の積立額"
            unit="円"
            value={form.monthly}
            min={0}
            max={1_000_000}
            step={1_000}
            onChange={(v) => update("monthly", v)}
          />
          <Field
            label="想定年利"
            unit="%"
            hint="オルカン・S&P500 の長期実績は概ね 4〜7% です"
            value={form.rate}
            min={0}
            max={15}
            step={0.1}
            onChange={(v) => update("rate", v)}
          />
          <Field
            label="積立期間"
            unit="年"
            value={form.years}
            min={1}
            max={50}
            step={1}
            onChange={(v) => update("years", v)}
          />
          <Field
            label="初期投資額"
            unit="円"
            hint="まとまった資金があれば最初に入れる額。なくてもOK"
            value={form.initial}
            min={0}
            max={100_000_000}
            step={10_000}
            onChange={(v) => update("initial", v)}
          />
          <Button onClick={onShare} variant="secondary" className="w-full">
            {shareLabel}
          </Button>
        </Card>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Card>
              <CardLabel>最終評価額</CardLabel>
              <CardValue className="text-slate-900">{compactJPY(summary.finalValue)}</CardValue>
            </Card>
            <Card>
              <CardLabel>総積立額</CardLabel>
              <CardValue className="text-slate-700">{compactJPY(summary.totalPrincipal)}</CardValue>
            </Card>
            <Card>
              <CardLabel>利益</CardLabel>
              <CardValue className="text-emerald-600">{compactJPY(summary.totalProfit)}</CardValue>
            </Card>
            <Card>
              <CardLabel>利益率</CardLabel>
              <CardValue className="text-emerald-600">
                {formatPercent(summary.profitRatePercent, 1)}
              </CardValue>
            </Card>
          </div>

          <Card>
            <h2 className="text-sm font-semibold text-slate-700">資産の推移（年次）</h2>
            <div className="mt-4 h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={annualPoints.map((p: SimulationPoint) => ({
                    year: p.month / 12,
                    元本: Math.round(p.principal),
                    評価額: Math.round(p.value),
                    利益: Math.round(p.profit),
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="year"
                    tickFormatter={(y: number) => `${y}年`}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    tickFormatter={(v: number) => compactJPY(v)}
                    width={64}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(v: number) => compactJPY(v)}
                    labelFormatter={(y: number) => `${y}年経過時点`}
                  />
                  <Line
                    type="monotone"
                    dataKey="元本"
                    stroke="#64748b"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="評価額"
                    stroke="#0f172a"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="利益"
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {milestones.length > 0 ? (
            <Card>
              <h2 className="text-sm font-semibold text-slate-700">利益のマイルストーン</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {milestones.map((m) => (
                  <li
                    key={m.threshold}
                    className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-sm"
                  >
                    <span className="text-slate-700">利益 +{compactJPY(m.threshold)}</span>
                    <span className="font-semibold text-emerald-700">
                      {Math.floor(m.month / 12)}年{m.month % 12}か月
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          <p className="text-center text-xs text-slate-500">
            ※ 月次複利・期末払いモデル。実際の投資信託は基準価額変動があり一致しません。
            一般的な参考情報であり投資助言ではありません。
          </p>
        </div>
      </div>
    </main>
  );
}
