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
} from "recharts";
import {
  priceData,
  productionByMine,
  aiscVsGold,
  assetMix,
  rampTimeline,
  dataSources,
  profitabilityCompany,
  profitabilityByMine,
  profitabilityByMetal,
  profitabilityBySegment,
} from "@/data/eldorado-data";

interface ChartProps {
  id: string;
}

const COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444", "#ec4899"];

// Chart 1: Production by Mine
export function ProductionByMineChart({ id }: ChartProps) {
  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-2 text-zinc-100">Production by Mine (koz gold)</h3>
      <p className="text-xs text-zinc-500 mb-4">Source: Eldorado Gold quarterly reports | As of Q2 2026 | *Q3-Q4 projected</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={productionByMine}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="quarter" stroke="#888" angle={-15} textAnchor="end" height={80} />
          <YAxis stroke="#888" label={{ value: 'koz', angle: -90, position: 'insideLeft', style: { fill: '#888' } }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46" }}
            labelStyle={{ color: "#e4e4e7" }}
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

// Chart 2: AISC vs Gold Price
export function AISCvsGoldChart({ id }: ChartProps) {
  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-2 text-zinc-100">AISC vs Gold Price (USD/oz)</h3>
      <p className="text-xs text-zinc-500 mb-4">Source: Eldorado Gold MD&As (AISC), Kitco (gold) | As of Q2 2026</p>
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
          <Line type="monotone" dataKey="goldPrice" stroke="#eab308" name="Gold Price" strokeWidth={2} />
          <Line type="monotone" dataKey="aisc" stroke="#ef4444" name="AISC" strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="mt-3 text-sm text-zinc-400">
        Q2 2026 margin: ${aiscVsGold[aiscVsGold.length - 1].goldPrice - aiscVsGold[aiscVsGold.length - 1].aisc}/oz (realized gold minus AISC)
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

// Chart 5: ELD vs Gold Price (24 months)
export function ELDvsGoldChart({ id }: ChartProps) {
  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-2 text-zinc-100">ELD vs Gold Price (24 months)</h3>
      <p className="text-xs text-zinc-500 mb-4">Source: Yahoo Finance (ELD.TO CAD), Kitco (Gold USD/oz) | As of Aug 2026</p>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={priceData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" stroke="#888" angle={-45} textAnchor="end" height={80} />
          <YAxis yAxisId="left" stroke="#888" label={{ value: 'ELD (CAD)', angle: -90, position: 'insideLeft', style: { fill: '#888' } }} />
          <YAxis yAxisId="right" orientation="right" stroke="#888" label={{ value: 'Gold (USD)', angle: 90, position: 'insideRight', style: { fill: '#888' } }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46" }}
            labelStyle={{ color: "#e4e4e7" }}
          />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="eldPrice" stroke="#f59e0b" name="ELD (CAD)" strokeWidth={2} />
          <Line yAxisId="right" type="monotone" dataKey="goldPrice" stroke="#eab308" name="Gold (USD/oz)" strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
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
                <div className="text-sm text-zinc-400">TCC: ${mine.tcc}</div>
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
                <div className="text-sm text-zinc-400">TCC: ${mine.tcc}</div>
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
                <div className="text-sm text-zinc-400">TCC: ${mine.tcc}</div>
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
