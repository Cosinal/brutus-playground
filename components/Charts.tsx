"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";
import {
  productionByMine,
  aiscVsGold,
  assetMix,
  rampTimeline,
  dataSources,
  profitabilityCompany,
  profitabilityByMine,
  profitabilityByMetal,
  profitabilityBySegment,
  annualProduction,
  revenueAndFCF,
  marketPriceData,
} from "@/data/eldorado-data";

interface ChartProps {
  id: string;
}

const COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444", "#ec4899"];

// Chart 1: Production by Mine
export function ProductionByMineChart({ id }: ChartProps) {
  // Convert ounces to koz for display
  const dataInKoz = productionByMine.map(d => ({
    quarter: d.quarter,
    lamaque: (d.lamaque / 1000),
    kisladag: (d.kisladag / 1000),
    efemcukuru: (d.efemcukuru / 1000),
    olympias: (d.olympias / 1000),
    skouries: (d.skouries / 1000),
    mcilvenna: (d.mcilvenna / 1000),
  }));

  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-2 text-zinc-100">Production by Mine (koz gold)</h3>
      <p className="text-xs text-zinc-500 mb-4">Source: Eldorado Gold quarterly reports | As of Q2 2026 | Sourced data only</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={dataInKoz}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="quarter" stroke="#888" angle={-15} textAnchor="end" height={80} />
          <YAxis stroke="#888" label={{ value: 'koz', angle: -90, position: 'insideLeft', style: { fill: '#888' } }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46" }}
            labelStyle={{ color: "#e4e4e7" }}
            formatter={(value: any) => value.toFixed(1)}
          />
          <Legend />
          <Bar dataKey="lamaque" stackId="a" fill="#f59e0b" name="Lamaque" />
          <Bar dataKey="kisladag" stackId="a" fill="#10b981" name="Kışladağ" />
          <Bar dataKey="efemcukuru" stackId="a" fill="#3b82f6" name="Efemçukuru" />
          <Bar dataKey="olympias" stackId="a" fill="#8b5cf6" name="Olympias" />
          <Bar dataKey="skouries" stackId="a" fill="#ef4444" name="Skouries" />
          <Bar dataKey="mcilvenna" stackId="a" fill="#ec4899" name="McIlvenna Bay" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Chart 2: AISC vs Realized Gold Price
export function AISCvsGoldChart({ id }: ChartProps) {
  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-2 text-zinc-100">AISC vs Realized Gold Price (USD/oz)</h3>
      <p className="text-xs text-zinc-500 mb-4">Source: Eldorado Gold MD&As | As of Q2 2026 | Realized price omitted where not disclosed</p>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={aiscVsGold}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="period" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46" }}
            labelStyle={{ color: "#e4e4e7" }}
          />
          <Legend />
          <Line type="monotone" dataKey="realized" stroke="#eab308" name="Realized Gold" strokeWidth={2} connectNulls />
          <Line type="monotone" dataKey="aisc" stroke="#ef4444" name="AISC" strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="mt-3 text-sm text-zinc-400">
        Q2 2026 margin: $2,453/oz (realized $4,379 minus AISC $1,926)
      </div>
    </div>
  );
}

// Chart 3: Asset Mix (Q2 2026)
export function AssetMixChart({ id }: ChartProps) {
  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-2 text-zinc-100">Asset Mix — Q2 2026 Production</h3>
      <p className="text-xs text-zinc-500 mb-4">Source: Eldorado Gold Q2 2026 quarterly report | As of Q2 2026</p>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={assetMix}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ mine, percentage }) => `${mine} ${percentage}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="percentage"
          >
            {assetMix.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46" }}
            formatter={(value: any, name: string, props: any) => [
              `${props.payload.q2_2026_production_oz} oz (${value}%)`,
              props.payload.mine,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Chart 4: Ramp Timeline
export function RampTimelineChart({ id }: ChartProps) {
  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-2 text-zinc-100">Skouries & McIlvenna Bay Ramp</h3>
      <p className="text-xs text-zinc-500 mb-4">Source: Eldorado Gold project updates | As of August 2026</p>
      <div className="space-y-3">
        {rampTimeline.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-zinc-800 rounded border border-zinc-700">
            <div className="flex-1">
              <div className="font-medium text-zinc-100">{item.project} — {item.milestone}</div>
              <div className="text-sm text-zinc-400">
                Planned: {item.planned} {item.actual && `| Actual: ${item.actual}`}
              </div>
            </div>
            <div
              className={`px-3 py-1 rounded text-sm font-medium ${
                item.status === "achieved"
                  ? "bg-green-900 text-green-200"
                  : item.status === "on-track"
                  ? "bg-blue-900 text-blue-200"
                  : "bg-red-900 text-red-200"
              }`}
            >
              {item.status === "achieved" ? "✓ Achieved" : item.status === "on-track" ? "On Track" : "Delayed"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Chart 5: ELD vs Gold Price (Removed - use market data in growth mode)
// This chart used invented price data and has been deprecated
// Use GrowthMarketComparisonChart in growth mode for sourced market data
export function ELDvsGoldChart({ id }: ChartProps) {
  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-2 text-zinc-100">Market Price Data Not Available</h3>
      <p className="text-xs text-zinc-500 mb-4">Market comparison charts require Yahoo Finance or Stooq data</p>
      <div className="p-12 text-center text-zinc-400">
        <p className="mb-4">Historical market price data (EGO, ELD.TO, gold futures) is available in growth mode.</p>
        <p className="text-sm">Ask: "show growth" or "historical growth" to view time-series market comparisons.</p>
        <p className="text-xs mt-4 text-zinc-600">Current market close 2026-08-26: ELD.TO CAD 65.19, EGO USD 46.96</p>
      </div>
    </div>
  );
}

// PROFITABILITY MODE CHARTS

export function ProfitabilityCompanyChart({ id }: ChartProps) {
  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-2 text-zinc-100">Company Profitability Trend</h3>
      <p className="text-xs text-zinc-500 mb-4">Source: Eldorado Gold quarterly MD&As | Q2 2026 Realized: $4,379/oz, AISC: $1,926/oz → Margin: $2,453/oz</p>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={profitabilityCompany}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="period" stroke="#888" />
          <YAxis stroke="#888" label={{ value: 'USD/oz', angle: -90, position: 'insideLeft', style: { fill: '#888' } }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46" }}
            labelStyle={{ color: "#e4e4e7" }}
          />
          <Legend />
          <Line type="monotone" dataKey="realizedGold" stroke="#eab308" name="Realized Gold" strokeWidth={2} />
          <Line type="monotone" dataKey="aisc" stroke="#ef4444" name="AISC" strokeWidth={2} />
          <Bar dataKey="tcc" fill="#3b82f6" name="TCC" opacity={0.3} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ProfitabilityFCFChart({ id }: ChartProps) {
  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-2 text-zinc-100">Free Cash Flow: Operating vs Growth</h3>
      <p className="text-xs text-zinc-500 mb-4">Source: Eldorado Gold Q2 2026 MD&A | Q2 FCF: -$334.1M total, $40.9M ex-growth</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={profitabilityCompany.slice(-2)}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="period" stroke="#888" />
          <YAxis stroke="#888" label={{ value: '$M USD', angle: -90, position: 'insideLeft', style: { fill: '#888' } }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46" }}
            labelStyle={{ color: "#e4e4e7" }}
          />
          <Legend />
          <Bar dataKey="fcf" fill="#ef4444" name="Total FCF" />
          <Bar dataKey="fcfExGrowth" fill="#10b981" name="FCF ex-Growth" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ProfitabilityByMineChart({ id }: ChartProps) {
  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-2 text-zinc-100">Q2 2026 AISC by Mine & Country</h3>
      <p className="text-xs text-zinc-500 mb-4">Source: Eldorado Gold Q2 2026 MD&A | All figures USD/oz</p>
      <div className="space-y-4">
        <div>
          <div className="text-sm font-medium text-zinc-400 mb-2">Canada</div>
          {profitabilityByMine.filter(m => m.country === "Canada").map((mine, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-zinc-800 rounded border border-zinc-700 mb-2">
              <div className="flex-1">
                <div className="font-medium text-zinc-100">{mine.mine}</div>
                <div className="text-sm text-zinc-400">Production: {(mine.q2_2026_production_oz / 1000).toFixed(1)} koz</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-zinc-400">TCC: {mine.tcc ? `$${mine.tcc}` : 'N/A'}</div>
                <div className="font-medium text-zinc-100">AISC: ${mine.aisc}</div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="text-sm font-medium text-zinc-400 mb-2">Türkiye</div>
          {profitabilityByMine.filter(m => m.country === "Türkiye").map((mine, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-zinc-800 rounded border border-zinc-700 mb-2">
              <div className="flex-1">
                <div className="font-medium text-zinc-100">{mine.mine}</div>
                <div className="text-sm text-zinc-400">Production: {(mine.q2_2026_production_oz / 1000).toFixed(1)} koz</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-zinc-400">TCC: {mine.tcc ? `$${mine.tcc}` : 'N/A'}</div>
                <div className="font-medium text-zinc-100">AISC: ${mine.aisc}</div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="text-sm font-medium text-zinc-400 mb-2">Greece</div>
          {profitabilityByMine.filter(m => m.country === "Greece").map((mine, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-zinc-800 rounded border border-zinc-700 mb-2">
              <div className="flex-1">
                <div className="font-medium text-zinc-100">{mine.mine}</div>
                <div className="text-sm text-zinc-400">Production: {(mine.q2_2026_production_oz / 1000).toFixed(1)} koz</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-zinc-400">TCC: {mine.tcc ? `$${mine.tcc}` : 'N/A'}</div>
                <div className="font-medium text-zinc-100">AISC: ${mine.aisc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProfitabilityByMetalChart({ id }: ChartProps) {
  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-2 text-zinc-100">Revenue by Metal</h3>
      <p className="text-xs text-zinc-500 mb-4">Source: Eldorado Gold quarterly reports | Q2 2026: Gold $449.7M, Other $37.8M (Cu/Zn/Ag)</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={profitabilityByMetal}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="period" stroke="#888" />
          <YAxis stroke="#888" label={{ value: '$M USD', angle: -90, position: 'insideLeft', style: { fill: '#888' } }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46" }}
            labelStyle={{ color: "#e4e4e7" }}
          />
          <Legend />
          <Bar dataKey="goldRevenue" stackId="a" fill="#eab308" name="Gold Revenue" />
          <Bar dataKey="otherRevenue" stackId="a" fill="#f97316" name="Other Metals" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ProfitabilityRevenueChart({ id }: ChartProps) {
  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-2 text-zinc-100">Revenue & Earnings Trend</h3>
      <p className="text-xs text-zinc-500 mb-4">Source: Eldorado Gold quarterly MD&As | All figures $M USD</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={profitabilityCompany}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="period" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46" }}
            labelStyle={{ color: "#e4e4e7" }}
          />
          <Legend />
          <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
          <Bar dataKey="adjEbitda" fill="#10b981" name="Adj. EBITDA" />
          <Bar dataKey="netIncome" fill="#eab308" name="Net Income" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// GROWTH MODE CHARTS

export function GrowthProductionByMineChart({ id }: ChartProps) {
  // Convert ounces to koz for display
  const dataInKoz = productionByMine.map(d => ({
    quarter: d.quarter,
    lamaque: (d.lamaque / 1000),
    kisladag: (d.kisladag / 1000),
    efemcukuru: (d.efemcukuru / 1000),
    olympias: (d.olympias / 1000),
    total: ((d.lamaque + d.kisladag + d.efemcukuru + d.olympias) / 1000),
  }));

  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-2 text-zinc-100">Quarterly Production by Mine — Sourced History</h3>
      <p className="text-xs text-zinc-500 mb-4">Source: Eldorado Gold quarterly reports Q1 2025–Q2 2026 | All figures are sourced ounces (no estimates)</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dataInKoz}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="quarter" stroke="#888" />
          <YAxis stroke="#888" label={{ value: 'koz gold', angle: -90, position: 'insideLeft', style: { fill: '#888' } }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46" }}
            labelStyle={{ color: "#e4e4e7" }}
            formatter={(value: any) => value.toFixed(1) + ' koz'}
          />
          <Legend />
          <Bar dataKey="lamaque" stackId="a" fill="#f59e0b" name="Lamaque" />
          <Bar dataKey="kisladag" stackId="a" fill="#10b981" name="Kışladağ" />
          <Bar dataKey="efemcukuru" stackId="a" fill="#3b82f6" name="Efemçukuru" />
          <Bar dataKey="olympias" stackId="a" fill="#8b5cf6" name="Olympias" />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-3 text-sm text-zinc-400">
        Total Q2 2026: {dataInKoz[dataInKoz.length - 1].total.toFixed(1)} koz across four operating mines
      </div>
    </div>
  );
}

export function GrowthAnnualProductionChart({ id }: ChartProps) {
  const dataInKoz = annualProduction.map(d => ({
    year: d.year,
    production: d.production / 1000,
    isGuidance: d.isGuidance,
    guidanceLow: d.guidanceLow ? d.guidanceLow / 1000 : undefined,
    guidanceHigh: d.guidanceHigh ? d.guidanceHigh / 1000 : undefined,
  }));

  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-2 text-zinc-100">Annual Gold Production + FY 2026 Guidance</h3>
      <p className="text-xs text-zinc-500 mb-4">Source: Eldorado Gold annual reports and FY 2026 guidance (495–600 koz)</p>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={dataInKoz}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="year" stroke="#888" />
          <YAxis stroke="#888" label={{ value: 'koz gold', angle: -90, position: 'insideLeft', style: { fill: '#888' } }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46" }}
            labelStyle={{ color: "#e4e4e7" }}
            formatter={(value: any, name: string) => {
              if (name === 'Production') return value.toFixed(0) + ' koz';
              return value ? value.toFixed(0) + ' koz' : 'N/A';
            }}
          />
          <Legend />
          <Bar dataKey="production" fill="#3b82f6" name="Production" />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="mt-3 text-sm text-zinc-400">
        FY 2025: 488 koz actual | FY 2026 Guidance: 495–600 koz (midpoint 547.5 koz)
      </div>
    </div>
  );
}

export function GrowthAISCvsRealizedChart({ id }: ChartProps) {
  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-2 text-zinc-100">AISC vs Realized Gold — Margin History</h3>
      <p className="text-xs text-zinc-500 mb-4">Source: Eldorado Gold quarterly MD&As Q1 2025–Q2 2026 | Realized price omitted where not disclosed</p>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={aiscVsGold}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="period" stroke="#888" />
          <YAxis stroke="#888" label={{ value: 'USD/oz', angle: -90, position: 'insideLeft', style: { fill: '#888' } }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46" }}
            labelStyle={{ color: "#e4e4e7" }}
          />
          <Legend />
          <Area type="monotone" dataKey="realized" fill="#eab30880" stroke="#eab308" name="Realized Gold" strokeWidth={2} connectNulls />
          <Line type="monotone" dataKey="aisc" stroke="#ef4444" name="AISC" strokeWidth={3} />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="mt-3 text-sm text-zinc-400">
        Q2 2026: Realized $4,379/oz, AISC $1,926/oz → Operating margin $2,453/oz
      </div>
    </div>
  );
}

export function GrowthRevenueAndFCFChart({ id }: ChartProps) {
  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-2 text-zinc-100">Revenue & Free Cash Flow Over Time</h3>
      <p className="text-xs text-zinc-500 mb-4">Source: Eldorado Gold quarterly financials | FCF-ex excludes Skouries + McBay starting Q2 2026</p>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={revenueAndFCF}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="period" stroke="#888" />
          <YAxis stroke="#888" label={{ value: '$M USD', angle: -90, position: 'insideLeft', style: { fill: '#888' } }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46" }}
            labelStyle={{ color: "#e4e4e7" }}
          />
          <Legend />
          <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
          <Line type="monotone" dataKey="fcf" stroke="#ef4444" name="Total FCF" strokeWidth={2} connectNulls />
          <Line type="monotone" dataKey="fcfExGrowth" stroke="#10b981" name="FCF ex-Growth" strokeWidth={2} connectNulls />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="mt-3 text-sm text-zinc-400">
        Q2 2026: Revenue $487.5M | Total FCF -$334.1M | Operating mines FCF (ex-growth) $40.9M
      </div>
    </div>
  );
}

export function GrowthMarketComparisonChart({ id }: ChartProps) {
  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-2 text-zinc-100">Market Performance: EGO vs ELD.TO vs Gold</h3>
      <p className="text-xs text-zinc-500 mb-4">Source: Indexed to 100 at 2021-08-27 | As of 2026-08-26 | EGO (USD), ELD.TO (CAD), Gold (comparative)</p>
      {marketPriceData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={marketPriceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="date" 
                stroke="#888" 
                angle={-45} 
                textAnchor="end" 
                height={80}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { year: '2-digit', month: 'short' });
                }}
              />
              <YAxis stroke="#888" label={{ value: 'Indexed (100 = Aug 2021)', angle: -90, position: 'insideLeft', style: { fill: '#888' } }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46" }}
                labelStyle={{ color: "#e4e4e7" }}
                formatter={(value: any) => value ? value.toFixed(0) : 'N/A'}
              />
              <Legend />
              <Line type="monotone" dataKey="EGO" stroke="#f59e0b" name="EGO (NYSE, USD)" strokeWidth={2} connectNulls />
              <Line type="monotone" dataKey="ELD_TO" stroke="#10b981" name="ELD.TO (TSX, CAD)" strokeWidth={2} connectNulls />
              <Line type="monotone" dataKey="gold" stroke="#eab308" name="Gold" strokeWidth={2} connectNulls />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 text-sm text-zinc-400">
            Market close 2026-08-26: ELD.TO CAD 65.19 (-1.97%), EGO USD 46.96 (-2.45%) | 52w range: ELD.TO CAD 32.77–69.46, EGO USD 23.81–51.16
          </div>
        </>
      ) : (
        <div className="p-12 text-center text-zinc-400">
          <p className="mb-4">5-year indexed comparison (EGO in USD, ELD.TO in CAD, gold)</p>
          <p className="text-sm mb-6">Market data unavailable. Requires Yahoo Finance v8 chart API or Stooq CSV.</p>
          <div className="space-y-2 text-left max-w-md mx-auto bg-zinc-800 p-4 rounded border border-zinc-700">
            <div className="text-sm font-medium text-zinc-300">Market Close 2026-08-26:</div>
            <div className="text-sm text-zinc-400">ELD.TO (TSX): CAD 65.19 (-1.97%)</div>
            <div className="text-sm text-zinc-400">EGO (NYSE): USD 46.96 (-2.45%)</div>
            <div className="text-sm text-zinc-400">52-week range: ELD.TO CAD 32.77–69.46, EGO USD 23.81–51.16</div>
          </div>
        </div>
      )}
    </div>
  );
}
