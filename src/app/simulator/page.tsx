import type { Metadata } from "next";
import { SimulatorClient } from "./simulator-client";
import { fromSearchParams } from "@/lib/simulator/schema";

export const metadata: Metadata = {
  title: "新NISA積立シミュレーター",
  description:
    "毎月の積立額・想定年利・期間を入力するだけで、将来の資産・利益・マイルストーンをグラフで可視化します。",
};

type SearchParams = Promise<Record<string, string | undefined>>;

export default async function SimulatorPage({ searchParams }: { searchParams: SearchParams }) {
  const raw = await searchParams;
  const initial = fromSearchParams(raw);
  return <SimulatorClient initial={initial} />;
}
