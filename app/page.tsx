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
  GrowthSECFinancialsChart,
} from "@/components/Charts";
import { company, dataSources } from "@/data/company-data";
import { companyInfo } from "@/data/packs/eldorado-operations";
import { BoardMode } from "@/lib/chat-parser";

interface ChartConfig {
  id: string;
  component: React.ComponentType<any>;
  visible: boolean;
  props?: Record<string, any>;
}

// Build chart configurations based on company capabilities
const buildDefaultCharts = (): ChartConfig[] => {
  const charts: ChartConfig[] = [];
  
  // Operations-specific charts (only if company has mining operations pack)
  if (company.hasMiningOperationsPack) {
    charts.push(
      { id: "production", component: ProductionByMineChart, visible: true },
      { id: "aisc", component: AISCvsGoldChart, visible: true },
      { id: "mix", component: AssetMixChart, visible: true },
      { id: "ramp", component: RampTimelineChart, visible: true }
    );
  }
  
  // Always include market chart (available for all companies with tickers)
  charts.push({ id: "price", component: ELDvsGoldChart, visible: true });
  
  return charts;
};

const buildProfitabilityCharts = (): ChartConfig[] => {
  const charts: ChartConfig[] = [];
  
  // Profitability charts only available with mining operations pack
  if (company.hasMiningOperationsPack) {
    charts.push(
      { id: "profitability-company", component: ProfitabilityCompanyChart, visible: true },
      { id: "profitability-fcf", component: ProfitabilityFCFChart, visible: true },
      { id: "profitability-mine", component: ProfitabilityByMineChart, visible: true },
      { id: "profitability-metal", component: ProfitabilityByMetalChart, visible: true },
      { id: "profitability-revenue", component: ProfitabilityRevenueChart, visible: true }
    );
  }
  
  return charts;
};

const buildGrowthCharts = (): ChartConfig[] => {
  const charts: ChartConfig[] = [];
  
  // Growth charts: operations-specific ones only if pack available
  if (company.hasMiningOperationsPack) {
    charts.push(
      { id: "growth-production", component: GrowthProductionByMineChart, visible: true },
      { id: "growth-annual", component: GrowthAnnualProductionChart, visible: true },
      { id: "growth-aisc", component: GrowthAISCvsRealizedChart, visible: true },
      { id: "growth-revenue-fcf", component: GrowthRevenueAndFCFChart, visible: true }
    );
  }
  
  // Always include market comparison chart
  charts.push({ id: "growth-market", component: GrowthMarketComparisonChart, visible: true });
  
  // Add SEC financials chart if available
  charts.push({ id: "growth-sec-financials", component: GrowthSECFinancialsChart, visible: true });
  
  return charts;
};

export default function Home() {
  const [mode, setMode] = useState<BoardMode>("default");
  const [charts, setCharts] = useState<ChartConfig[]>(buildDefaultCharts());
  const [filter, setFilter] = useState<string | null>(null);

  const handleChartAction = (action: any) => {
    if (action.type === "reset") {
      setMode("default");
      setCharts(buildDefaultCharts());
      setFilter(null);
    } else if (action.type === "switch_mode") {
      setMode(action.mode);
      if (action.mode === "profitability") {
        setCharts(buildProfitabilityCharts());
        setFilter(null);
      } else if (action.mode === "growth") {
        setCharts(buildGrowthCharts());
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
      if (!chartExists && action.target === "production" && company.hasMiningOperationsPack) {
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
    if (mode === "profitability") return `${company.shortName} Profitability`;
    if (mode === "growth") return `${company.shortName} Growth`;
    return `${company.shortName} Dashboard`;
  };

  const getHeaderStats = () => {
    if (!company.hasMiningOperationsPack) {
      return (
        <div className="text-xs sm:text-sm text-zinc-400">
          <span>{company.sector} • {company.industry}</span>
        </div>
      );
    }
    
    // Eldorado-specific stats (when operations pack exists)
    if (mode === "default") {
      return (
        <div className="text-xs sm:text-sm text-zinc-400 flex flex-wrap gap-3">
          <span>H1 2026: {companyInfo.h1_2026_production}</span>
          <span>AISC: {companyInfo.q2_2026_aisc}</span>
        </div>
      );
    } else if (mode === "profitability") {
      return (
        <div className="text-xs sm:text-sm text-zinc-400 flex flex-wrap gap-3">
          <span>Realized: $4,379/oz</span>
          <span>AISC: $1,926/oz</span>
          <span>Margin: $2,453/oz</span>
        </div>
      );
    } else if (mode === "growth") {
      return (
        <div className="text-xs sm:text-sm text-zinc-400 flex flex-wrap gap-3">
          <span>Q1 2025–Q2 2026</span>
          <span>FY 2025: 488 koz</span>
          <span>FY 2026 Guidance: 495–600 koz</span>
        </div>
      );
    }
  };

  const getFooterOperations = () => {
    if (company.hasMiningOperationsPack) {
      return (
        <p className="text-xs">
          Operations: {companyInfo.operations.join(", ")}
        </p>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-900 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{getModeTitle()}</h1>
              <div className="text-xs text-zinc-500 mt-1">
                {Object.values(company.tickers).filter(t => t).join(" / ")} | As of {dataSources.asOf}
              </div>
            </div>
            {getHeaderStats()}
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
            {getFooterOperations()}
            <p className="text-xs">
              Live at: <a href="https://brutus-playground-xrz5.vercel.app" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">brutus-playground-xrz5.vercel.app</a>
            </p>
            <p className="text-xs text-zinc-600">
              Plug-and-play public company dashboard kit. Not investment advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
