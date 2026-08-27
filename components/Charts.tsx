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
  productionByMine,
  aiscVsRealized,
  assetMixH1_2026,
  projectStatus,
  marketData,
  q2_2026,
  dataSources,
} from "@/data/eldorado-data";

interface ChartProps {
  id: string;
}

const COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"];

// Chart 1: Production by Mine (Q1 2025 → Q2 2026)
export function ProductionByMineChart({ id }: ChartProps) {
  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-2 text-zinc-100">Production by Mine (oz gold)</h3>
      <p className="text-xs text-zinc-500 mb-4">
        Source: Eldorado Gold quarterly reports (PDF finals) | As of {dataSources.asOf}
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={productionByMine}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="quarter" stroke="#888" angle={-15} textAnchor="end" height={80} />
          <YAxis stroke="#888" label={{ value: 'oz', angle: -90, position: 'insideLeft', style: { fill: '#888' } }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46" }}
            labelStyle={{ color: "#e4e4e7" }}
          />
          <Legend />
          <Bar dataKey="lamaque" stackId="a" fill="#f59e0b" name="Lamaque" />
          <Bar dataKey="kisladag" stackId="a" fill="#10b981" name="Kışladağ" />
          <Bar dataKey="efemcukuru" stackId="a" fill="#3b82f6" name="Efemçukuru" />
          <Bar dataKey="olympias" stackId="a" fill="#8b5cf6" name="Olympias" />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-3 text-xs text-zinc-400">
        Skouries and McIlvenna Bay: 0 oz gold reported to date. Skouries first concentrate expected Q3 2026 (not yet shipped as of 2026-07-30). McIlvenna Bay commercial expected Q3 2026.
      </div>
    </div>
  );
}

// Chart 2: AISC vs Realized Gold
export function AISCvsGoldChart({ id }: ChartProps) {
  // Filter out entries with null realized
  const dataWithRealized = aiscVsRealized.filter((d) => d.realized !== null);

  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-2 text-zinc-100">AISC vs Realized Gold (USD/oz)</h3>
      <p className="text-xs text-zinc-500 mb-4">
        Source: Eldorado Gold quarterly MD&As | As of {dataSources.asOf}
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={dataWithRealized}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="period" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46" }}
            labelStyle={{ color: "#e4e4e7" }}
          />
          <Legend />
          <Line type="monotone" dataKey="realized" stroke="#eab308" name="Realized Gold" strokeWidth={2} />
          <Line type="monotone" dataKey="aisc" stroke="#ef4444" name="AISC" strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="mt-3 text-sm text-zinc-400">
        Q2 2026: Realized ${q2_2026.realized_per_oz}/oz, AISC ${q2_2026.aisc_per_oz}/oz → Margin ${q2_2026.margin_per_oz}/oz (realized minus AISC)
      </div>
      <div className="mt-1 text-xs text-zinc-500">
        Q2 AISC above FY ops guidance ($1,670–1,870) but production is H2-weighted; not a concluded miss.
      </div>
    </div>
  );
}

// Chart 3: Asset Mix H1 2026
export function AssetMixChart({ id }: ChartProps) {
  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-2 text-zinc-100">Asset Mix — H1 2026 Production</h3>
      <p className="text-xs text-zinc-500 mb-4">
        Source: Eldorado Gold H1 2026 data | As of {dataSources.asOf}
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={assetMixH1_2026}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ mine, percentage }) => `${mine} ${percentage}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="percentage"
          >
            {assetMixH1_2026.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46" }}
            formatter={(value: any, name: string, props: any) => [
              `${props.payload.h1_2026_oz.toLocaleString()} oz (${value}%)`,
              props.payload.mine,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-3 text-xs text-zinc-400">
        H1 2026 total: 204,974 oz gold. Skouries and McIlvenna Bay not yet producing gold for reporting.
      </div>
    </div>
  );
}

// Chart 4: Project Status / Ramp Timeline
export function RampTimelineChart({ id }: ChartProps) {
  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-2 text-zinc-100">Skouries & McIlvenna Bay Status</h3>
      <p className="text-xs text-zinc-500 mb-4">
        Source: Eldorado Gold project updates, Q2 2026 NR (2026-07-30) | As of {dataSources.asOf}
      </p>
      <div className="space-y-3">
        {projectStatus.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-zinc-800 rounded border border-zinc-700">
            <div className="flex-1">
              <div className="font-medium text-zinc-100">
                {item.project} — {item.milestone}
              </div>
              <div className="text-sm text-zinc-400">
                {item.status === "expected" ? `Expected: ${item.expected}` : `Actual: ${item.actual}`}
              </div>
            </div>
            <div
              className={`px-3 py-1 rounded text-sm font-medium ${
                item.status === "achieved"
                  ? "bg-green-900 text-green-200"
                  : item.status === "expected"
                  ? "bg-blue-900 text-blue-200"
                  : "bg-zinc-700 text-zinc-300"
              }`}
            >
              {item.status === "achieved" ? "✓ Achieved" : "Expected"}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-400">
        <div className="font-medium text-zinc-300 mb-1">Key Notes</div>
        <ul className="space-y-1 list-disc list-inside">
          <li>Skouries 97% complete as of 2026-06-30; first ore crushed July 2026 on temp power</li>
          <li>Skouries first concentrate NOT yet reported as of 2026-07-30; final grid energization remaining</li>
          <li>McIlvenna Bay Q2 2026: 5,405 t processed → 65,398 payable Cu lb (not yet commercial)</li>
          <li>Neither project in AISC denominator until commercial production achieved</li>
        </ul>
      </div>
    </div>
  );
}

// Chart 5: ELD vs Gold Price (Market Data)
export function ELDvsGoldChart({ id }: ChartProps) {
  // We only have current market snapshot, not 24-month series
  // Show current levels as callout instead of empty chart

  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-2 text-zinc-100">Market Snapshot — {dataSources.asOf}</h3>
      <p className="text-xs text-zinc-500 mb-4">
        Source: Yahoo Finance (ELD.TO, EGO regular close) | COMEX GC=F futures
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-zinc-800 rounded border border-zinc-700">
          <div className="text-sm text-zinc-400 mb-1">ELD.TO (TSX)</div>
          <div className="text-2xl font-bold text-zinc-100">C${marketData.ELD_TO_CAD.toFixed(2)}</div>
          <div className={`text-sm ${marketData.ELD_change_pct < 0 ? 'text-red-400' : 'text-green-400'}`}>
            {marketData.ELD_change_pct.toFixed(2)}%
          </div>
          <div className="text-xs text-zinc-500 mt-2">
            Market Cap: C${marketData.ELD_marketCap_B_CAD.toFixed(3)}B
          </div>
          <div className="text-xs text-zinc-500">
            52-week: C$32.77 – C$69.46
          </div>
        </div>

        <div className="p-4 bg-zinc-800 rounded border border-zinc-700">
          <div className="text-sm text-zinc-400 mb-1">EGO (NYSE)</div>
          <div className="text-2xl font-bold text-zinc-100">${marketData.EGO_USD.toFixed(2)}</div>
          <div className={`text-sm ${marketData.EGO_change_pct < 0 ? 'text-red-400' : 'text-green-400'}`}>
            {marketData.EGO_change_pct.toFixed(2)}%
          </div>
          <div className="text-xs text-zinc-500 mt-2">
            Market Cap: ${marketData.EGO_marketCap_B_USD.toFixed(3)}B USD
          </div>
          <div className="text-xs text-zinc-500">
            52-week: $23.81 – $51.16
          </div>
        </div>

        <div className="p-4 bg-zinc-800 rounded border border-zinc-700 sm:col-span-2">
          <div className="text-sm text-zinc-400 mb-1">Gold (COMEX GC=F Futures)</div>
          <div className="text-2xl font-bold text-yellow-500">${marketData.gold_futures_COMEX.toFixed(1)}/oz</div>
          <div className="text-xs text-zinc-500 mt-2">
            Note: COMEX futures, not LBMA spot. Q2 2026 realized gold: ${q2_2026.realized_per_oz}/oz USD.
          </div>
        </div>

        <div className="p-4 bg-zinc-800 rounded border border-zinc-700 sm:col-span-2">
          <div className="text-sm text-zinc-400 mb-1">Q2 2026 Performance vs Market</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-zinc-500">Produced:</span>
              <span className="text-zinc-100 ml-2">{q2_2026.produced_oz.toLocaleString()} oz</span>
            </div>
            <div>
              <span className="text-zinc-500">Sold:</span>
              <span className="text-zinc-100 ml-2">{q2_2026.sold_oz.toLocaleString()} oz</span>
            </div>
            <div>
              <span className="text-zinc-500">Realized:</span>
              <span className="text-zinc-100 ml-2">${q2_2026.realized_per_oz}/oz</span>
            </div>
            <div>
              <span className="text-zinc-500">AISC:</span>
              <span className="text-zinc-100 ml-2">${q2_2026.aisc_per_oz}/oz</span>
            </div>
            <div>
              <span className="text-zinc-500">Margin:</span>
              <span className="text-green-400 ml-2">${q2_2026.margin_per_oz}/oz</span>
            </div>
            <div>
              <span className="text-zinc-500">Revenue:</span>
              <span className="text-zinc-100 ml-2">${q2_2026.revenue_M.toFixed(1)}M</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
