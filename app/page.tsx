"use client";

import { useState } from "react";
import ChatPanel from "@/components/ChatPanel";
import {
  ProductionByMineChart,
  AISCvsGoldChart,
  AssetMixChart,
  RampTimelineChart,
  ELDvsGoldChart,
  ProfitabilityCompanyChart,
  ProfitabilityFCFChart,
  ProfitabilityByMineChart,
  ProfitabilityByMetalChart,
  ProfitabilityRevenueChart,
  GrowthProductionByMineChart,
  GrowthAnnualProductionChart,
  GrowthAISCvsRealizedChart,
  GrowthRevenueAndFCFChart,
  GrowthMarketComparisonChart,
} from "@/components/Charts";
import { companyInfo, dataSources } from "@/data/eldorado-data";
import { BoardMode } from "@/lib/chat-parser";

interface ChartConfig {
  id: string;
  component: React.ComponentType<any>;
  visible: boolean;
  props?: Record<string, any>;
}

const defaultCharts: ChartConfig[] = [
  { id: "production", component: ProductionByMineChart, visible: true },
  { id: "aisc", component: AISCvsGoldChart, visible: true },
  { id: "mix", component: AssetMixChart, visible: true },
  { id: "ramp", component: RampTimelineChart, visible: true },
  { id: "price", component: ELDvsGoldChart, visible: true },
];

const profitabilityCharts: ChartConfig[] = [
  { id: "profitability-company", component: ProfitabilityCompanyChart, visible: true },
  { id: "profitability-fcf", component: ProfitabilityFCFChart, visible: true },
  { id: "profitability-mine", component: ProfitabilityByMineChart, visible: true },
  { id: "profitability-metal", component: ProfitabilityByMetalChart, visible: true },
  { id: "profitability-revenue", component: ProfitabilityRevenueChart, visible: true },
];

const growthCharts: ChartConfig[] = [
  { id: "growth-production", component: GrowthProductionByMineChart, visible: true },
  { id: "growth-annual", component: GrowthAnnualProductionChart, visible: true },
  { id: "growth-aisc", component: GrowthAISCvsRealizedChart, visible: true },
  { id: "growth-revenue-fcf", component: GrowthRevenueAndFCFChart, visible: true },
  { id: "growth-market", component: GrowthMarketComparisonChart, visible: true },
];

export default function Home() {
  const [mode, setMode] = useState<BoardMode>("default");
  const [charts, setCharts] = useState<ChartConfig[]>(defaultCharts);
  const [filter, setFilter] = useState<string | null>(null);

  const handleChartAction = (action: any) => {
    if (action.type === "reset") {
      setMode("default");
      setCharts(defaultCharts);
      setFilter(null);
    } else if (action.type === "switch_mode") {
      setMode(action.mode);
      if (action.mode === "profitability") {
        setCharts(profitabilityCharts);
        setFilter(null);
      } else if (action.mode === "growth") {
        setCharts(growthCharts);
        setFilter(null);
      }
    } else if (action.type === "filter") {
      setFilter(action.target);
    } else if (action.type === "remove") {
      setCharts((prev) =>
        prev.map((chart) =>
          chart.id === action.target ? { ...chart, visible: false } : chart
        )
      );
    } else if (action.type === "add") {
      const chartExists = charts.some((c) => c.id === action.target);
      if (!chartExists && action.target === "production") {
        setCharts((prev) => [
          ...prev,
          { id: "production", component: ProductionByMineChart, visible: true },
        ]);
      }
    } else if (action.type === "modify" && action.target === "theme") {
      // Theme modification handled via CSS or props if needed
    }
  };

  const visibleCharts = charts.filter((c) => c.visible);

  const getModeTitle = () => {
    if (mode === "profitability") return "Profitability — Q2 2026";
    if (mode === "growth") return "Growth — Sourced History";
    return "Eldorado Gold Dashboard";
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-900 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{getModeTitle()}</h1>
              <div className="text-xs text-zinc-500 mt-1">
                {mode === "default" ? `${companyInfo.tickers} | As of ${dataSources.asOf}` : `Source: ${dataSources.sources[0]}`}
              </div>
            </div>
            <div className="text-xs sm:text-sm text-zinc-400 flex flex-wrap gap-3">
              {mode === "default" && (
                <>
                  <span>H1 2026: {companyInfo.h1_2026_production}</span>
                  <span>AISC: {companyInfo.q2_2026_aisc}</span>
                </>
              )}
              {mode === "profitability" && (
                <>
                  <span>Realized: $4,379/oz</span>
                  <span>AISC: $1,926/oz</span>
                  <span>Margin: $2,453/oz</span>
                </>
              )}
              {mode === "growth" && (
                <>
                  <span>Q1 2025–Q2 2026</span>
                  <span>FY 2025: 488 koz</span>
                  <span>FY 2026 Guidance: 495–600 koz</span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {visibleCharts.length === 0 ? (
              <div className="bg-zinc-900 rounded-lg p-12 border border-zinc-800 text-center">
                <p className="text-zinc-400">All charts hidden. Use chat to restore or add charts.</p>
              </div>
            ) : (
              visibleCharts.map((chart) => {
                const Component = chart.component;
                return <Component key={chart.id} id={chart.id} {...(chart.props || {})} />;
              })
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <div className="h-[calc(100vh-10rem)]">
                <ChatPanel onChartAction={handleChartAction} currentMode={mode} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-800 bg-zinc-900 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-zinc-500 space-y-2">
            <p className="font-medium text-zinc-400">
              Built by <a href="https://linkedin.com/in/jordenshaw587/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Jorden Shaw</a>
            </p>
            <p className="text-xs">
              Data sources: {dataSources.sources.join(" • ")}
            </p>
            <p className="text-xs">
              Operations: {companyInfo.operations.join(", ")}
            </p>
            <p className="text-xs text-zinc-600">
              Portfolio piece using public data only. Not investment advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
