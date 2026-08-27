"use client";

import { useState } from "react";
import ChatPanel from "@/components/ChatPanel";
import {
  PriceChart,
  ProductionChart,
  AISCChart,
  RampChart,
  MixChart,
  DecisionCallout,
  CopperProductionChart,
} from "@/components/Charts";
import { companyInfo } from "@/data/eldorado-data";

interface ChartConfig {
  id: string;
  component: React.ComponentType<any>;
  visible: boolean;
  props?: Record<string, any>;
}

export default function Home() {
  const [charts, setCharts] = useState<ChartConfig[]>([
    { id: "price", component: PriceChart, visible: true },
    { id: "production", component: ProductionChart, visible: true },
    { id: "aisc", component: AISCChart, visible: true, props: { chartType: "line" } },
    { id: "ramp", component: RampChart, visible: true },
    { id: "mix", component: MixChart, visible: true },
    { id: "decision", component: DecisionCallout, visible: true },
  ]);

  const handleChartAction = (action: any) => {
    if (action.type === "modify" && action.target === "aisc") {
      setCharts((prev) =>
        prev.map((chart) =>
          chart.id === "aisc" ? { ...chart, props: action.params } : chart
        )
      );
    } else if (action.type === "add" && action.target === "copper") {
      const copperExists = charts.some((c) => c.id === "copper");
      if (!copperExists) {
        setCharts((prev) => [
          ...prev,
          { id: "copper", component: CopperProductionChart, visible: true },
        ]);
      }
    } else if (action.type === "remove") {
      setCharts((prev) =>
        prev.map((chart) =>
          chart.id === action.target ? { ...chart, visible: false } : chart
        )
      );
    }
  };

  const visibleCharts = charts.filter((c) => c.visible);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-900">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">
            Jorden Shaw / Eldorado Gold Decision Dashboard
          </h1>
          <div className="mt-2 text-sm text-zinc-400 flex flex-wrap gap-4">
            <span>{companyInfo.name}</span>
            <span>{companyInfo.tickers}</span>
            <span>H1 2026: {companyInfo.h1_2026_production}</span>
            <span>FY 2026 Guidance: {companyInfo.fy_2026_guidance}</span>
            <span>Q2 2026 AISC: {companyInfo.q2_2026_aisc}</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {visibleCharts.length === 0 ? (
              <div className="bg-zinc-900 rounded-lg p-12 border border-zinc-800 text-center">
                <p className="text-zinc-400">All charts hidden. Use chat to add charts back.</p>
              </div>
            ) : (
              visibleCharts.map((chart) => {
                const Component = chart.component;
                return <Component key={chart.id} id={chart.id} {...(chart.props || {})} />;
              })
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6">
              <div className="h-[calc(100vh-8rem)]">
                <ChatPanel onChartAction={handleChartAction} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-800 bg-zinc-900 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-zinc-500">
          <p>
            Data from public sources: {companyInfo.name} news releases, SEDAR+/SEC filings, public market data.
          </p>
          <p className="mt-1">
            Operations: {companyInfo.operations.join(", ")}
          </p>
          <p className="mt-2 text-zinc-600">
            Built by Jorden Shaw as a portfolio piece. Not investment advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
