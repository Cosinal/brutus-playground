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

// General company data (available for all companies)
import {
  company,
  marketPriceData,
  marketDataInfo,
  dataSources,
  secFinancials,
} from "@/data/company-data";

// Eldorado-specific mining operations pack (conditional)
import {
  productionByMine,
  aiscVsGold,
  assetMix,
  rampTimeline,
  profitabilityCompany,
  profitabilityByMine,
  profitabilityByMetal,
  profitabilityBySegment,
  annualProduction,
  revenueAndFCF,
  companyInfo,
} from "@/data/packs/eldorado-operations";

// Milestone ledger for filings-diff / expected-vs-achieved
import {
  milestoneLedger,
  latestFilings,
  milestoneLedgerMeta,
} from "@/data/milestone-ledger";

interface ChartProps {
  id: string;
  filter?: string | null;
}

const COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444", "#ec4899"];

// Chart 1: Production by Mine
export function ProductionByMineChart({ id, filter }: ChartProps) {
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

  // Define which mines to show based on filter
  const shouldShow = (mine: string) => {
    if (!filter) return true;
    
    const mineLower = mine.toLowerCase();
    if (filter === "lamaque") return mineLower === "lamaque";
    if (filter === "skouries") return mineLower === "skouries";
    if (filter === "canada") return mineLower === "lamaque" || mineLower === "mcilvenna";
    if (filter === "turkiye") return mineLower === "kisladag" || mineLower === "efemcukuru";
    if (filter === "greece") return mineLower === "olympias" || mineLower === "skouries";
    if (filter === "exclude-canada") return mineLower !== "lamaque" && mineLower !== "mcilvenna";
    if (filter === "exclude-turkiye") return mineLower !== "kisladag" && mineLower !== "efemcukuru";
    if (filter === "exclude-greece") return mineLower !== "olympias" && mineLower !== "skouries";
    return true;
  };

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
          {shouldShow("lamaque") && <Bar dataKey="lamaque" stackId="a" fill="#f59e0b" name="Lamaque" />}
          {shouldShow("kisladag") && <Bar dataKey="kisladag" stackId="a" fill="#10b981" name="Kışladağ" />}
          {shouldShow("efemcukuru") && <Bar dataKey="efemcukuru" stackId="a" fill="#3b82f6" name="Efemçukuru" />}
          {shouldShow("olympias") && <Bar dataKey="olympias" stackId="a" fill="#8b5cf6" name="Olympias" />}
          {shouldShow("skouries") && <Bar dataKey="skouries" stackId="a" fill="#ef4444" name="Skouries" />}
          {shouldShow("mcilvenna") && <Bar dataKey="mcilvenna" stackId="a" fill="#ec4899" name="McIlvenna Bay" />}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Chart 2: AISC vs Realized Gold Price
export function AISCvsGoldChart({ id, filter }: ChartProps) {
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
export function AssetMixChart({ id, filter }: ChartProps) {
  // Filter data based on filter prop
  const getFilteredData = () => {
    if (!filter) return assetMix;
    
    // Use profitabilityByMine to determine country for future-proofing (e.g., if McIlvenna Bay added to assetMix)
    const canadianMines = profitabilityByMine.filter(m => m.country === "Canada").map(m => m.mine);
    const turkiyeMines = profitabilityByMine.filter(m => m.country === "Türkiye").map(m => m.mine);
    const greeceMines = profitabilityByMine.filter(m => m.country === "Greece").map(m => m.mine);
    
    if (filter === "lamaque") return assetMix.filter(m => m.mine === "Lamaque");
    if (filter === "skouries") return assetMix.filter(m => m.mine === "Skouries");
    if (filter === "canada") return assetMix.filter(m => canadianMines.includes(m.mine));
    if (filter === "turkiye") return assetMix.filter(m => turkiyeMines.includes(m.mine));
    if (filter === "greece") return assetMix.filter(m => greeceMines.includes(m.mine));
    if (filter === "exclude-canada") return assetMix.filter(m => !canadianMines.includes(m.mine));
    if (filter === "exclude-turkiye") return assetMix.filter(m => !turkiyeMines.includes(m.mine));
    if (filter === "exclude-greece") return assetMix.filter(m => !greeceMines.includes(m.mine));
    
    return assetMix;
  };

  const filteredData = getFilteredData();
  
  // Recalculate percentages so filtered slices sum to 100%
  const totalProduction = filteredData.reduce((sum, item) => sum + item.q2_2026_production, 0);
  const dataWithRecalculatedPercentages = filteredData.map(item => ({
    ...item,
    percentage: totalProduction > 0 ? parseFloat(((item.q2_2026_production / totalProduction) * 100).toFixed(1)) : 0,
  }));

  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-2 text-zinc-100">Asset Mix — Q2 2026 Production</h3>
      <p className="text-xs text-zinc-500 mb-4">Source: Eldorado Gold Q2 2026 quarterly report | As of Q2 2026</p>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={dataWithRecalculatedPercentages}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ mine, percentage }) => `${mine} ${percentage}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="percentage"
          >
            {dataWithRecalculatedPercentages.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46" }}
            formatter={(value: any, name: string, props: any) => [
              `${props.payload.q2_2026_production} oz (${value}%)`,
              props.payload.mine,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Chart 4: Expected vs Achieved — Filings Diff
export function ExpectedVsAchievedChart({ id, filter }: ChartProps) {
  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-2 text-zinc-100">Expected vs Achieved — Filings Diff</h3>
      <p className="text-xs text-zinc-500 mb-4">
        Source: SEC 6-K filings (Q2 2026 MD&A 2026-07-30, McBay NR 2026-06-08) | Public data only
      </p>
      <div className="space-y-3">
        {milestoneLedger.map((item, idx) => (
          <div key={idx} className="p-3 bg-zinc-800 rounded border border-zinc-700">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="font-medium text-zinc-100">{item.metric}</div>
                <div className="text-xs text-zinc-500 mt-1">
                  {item.category === "ramp" && "Ramp Milestone"}
                  {item.category === "production" && "Production"}
                  {item.category === "cost" && "Cost Metric"}
                  {item.category === "guidance" && "Guidance"}
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap ${
                  item.status === "achieved"
                    ? "bg-green-900 text-green-200"
                    : item.status === "expected"
                    ? "bg-blue-900 text-blue-200"
                    : item.status === "slipped"
                    ? "bg-red-900 text-red-200"
                    : "bg-zinc-700 text-zinc-300"
                }`}
              >
                {item.status === "achieved" && "✓ Achieved"}
                {item.status === "expected" && "Expected"}
                {item.status === "slipped" && "Slipped"}
                {item.status === "unchanged" && "Unchanged"}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm mt-2">
              <div>
                <div className="text-xs text-zinc-500">Prior Expected</div>
                <div className="text-zinc-200 mt-1">{item.priorExpected || "—"}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-500">Latest Printed</div>
                <div className="text-zinc-200 mt-1">{item.latestPrinted || "—"}</div>
              </div>
            </div>
            <div className="text-xs text-zinc-500 mt-2">
              {item.source} ({item.sourceDate})
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-zinc-600">
        Latest filing: Q2 2026 6-K (2026-07-30). All milestones sourced from public filings.
      </div>
    </div>
  );
}

// Chart 4 (Legacy): Ramp Timeline - DEPRECATED in favor of ExpectedVsAchievedChart
// Kept for backward compatibility but not used in default board
export function RampTimelineChart({ id, filter }: ChartProps) {
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

// Chart 5: Market Performance — 5-Year History
// Source: Yahoo Finance v8 chart API
// Data: Dynamic tickers from company config
// Display: Indexed to 100 at first non-null close (relative performance)
export function ELDvsGoldChart({ id }: ChartProps) {
  if (marketPriceData.length === 0) {
    return (
      <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <h3 className="text-lg font-semibold mb-2 text-zinc-100">Market Price Data Not Available</h3>
        <p className="text-xs text-zinc-500 mb-4">Yahoo Finance data fetch required</p>
        <div className="p-8 text-center text-zinc-400">
          <p className="mb-2">Run: <code className="text-zinc-300">python scripts/fetch-yahoo-market.py</code></p>
          <p className="text-sm">This will fetch market history for {company.name} from Yahoo Finance.</p>
        </div>
      </div>
    );
  }

  // Get ticker info for legend labels
  const tickers = marketDataInfo.tickers as Record<string, { symbol: string; currency: string }>;
  const tickerKeys = Object.keys(tickers);
  
  // Generate colors for each ticker
  const colors = ["#f59e0b", "#10b981", "#eab308", "#3b82f6", "#8b5cf6"];
  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-2 text-zinc-100">5-Year Market Performance</h3>
      <p className="text-xs text-zinc-500 mb-4">
        Source: Yahoo Finance, {marketDataInfo.interval} over {marketDataInfo.range} | Indexed to 100 at first close
      </p>
      <ResponsiveContainer width="100%" height={280}>
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
          <YAxis stroke="#888" label={{ value: 'Indexed (100 = start)', angle: -90, position: 'insideLeft', style: { fill: '#888' } }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46" }}
            labelStyle={{ color: "#e4e4e7" }}
            formatter={(value: any) => value !== null ? value.toFixed(1) : 'N/A'}
          />
          <Legend />
          {tickerKeys.map((tickerKey, idx) => {
            const ticker = tickers[tickerKey];
            const label = `${ticker.symbol} (${ticker.currency})`;
            return (
              <Line 
                key={tickerKey}
                type="monotone" 
                dataKey={tickerKey} 
                stroke={colors[idx % colors.length]} 
                name={label} 
                strokeWidth={2} 
                connectNulls 
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-3 text-sm text-zinc-400">
        Not investment advice. Data from {marketDataInfo.source}. Run <code className="text-xs">python scripts/fetch-yahoo-market.py</code> to refresh.
      </div>
    </div>
  );
}

// PROFITABILITY MODE CHARTS

export function ProfitabilityCompanyChart({ id, filter }: ChartProps) {
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

export function ProfitabilityFCFChart({ id, filter }: ChartProps) {
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

export function ProfitabilityByMineChart({ id, filter }: ChartProps) {
  // Helper to determine if a mine should be shown
  const shouldShowMine = (country: string, mine: string) => {
    if (!filter) return true;
    
    const mineLower = mine.toLowerCase();
    if (filter === "lamaque") return mineLower === "lamaque";
    if (filter === "skouries") return false; // Skouries not in Q2 2026 profitability (no production)
    if (filter === "canada") return country === "Canada";
    if (filter === "turkiye") return country === "Türkiye";
    if (filter === "greece") return country === "Greece";
    if (filter === "exclude-canada") return country !== "Canada";
    if (filter === "exclude-turkiye") return country !== "Türkiye";
    if (filter === "exclude-greece") return country !== "Greece";
    return true;
  };

  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-2 text-zinc-100">Q2 2026 AISC by Mine & Country</h3>
      <p className="text-xs text-zinc-500 mb-4">Source: Eldorado Gold Q2 2026 MD&A | All figures USD/oz</p>
      <div className="space-y-4">
        {shouldShowMine("Canada", "Lamaque") && (
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
        )}
        {shouldShowMine("Türkiye", "Kışladağ") && (
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
        )}
        {shouldShowMine("Greece", "Olympias") && (
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
        )}
      </div>
    </div>
  );
}

export function ProfitabilityByMetalChart({ id, filter }: ChartProps) {
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

export function ProfitabilityRevenueChart({ id, filter }: ChartProps) {
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

export function GrowthProductionByMineChart({ id, filter }: ChartProps) {
  // Convert ounces to koz for display
  const dataInKoz = productionByMine.map(d => ({
    quarter: d.quarter,
    lamaque: (d.lamaque / 1000),
    kisladag: (d.kisladag / 1000),
    efemcukuru: (d.efemcukuru / 1000),
    olympias: (d.olympias / 1000),
    total: ((d.lamaque + d.kisladag + d.efemcukuru + d.olympias) / 1000),
  }));

  // Define which mines to show based on filter
  const shouldShow = (mine: string) => {
    if (!filter) return true;
    
    const mineLower = mine.toLowerCase();
    if (filter === "lamaque") return mineLower === "lamaque";
    if (filter === "skouries") return false; // Skouries not in historical data yet
    if (filter === "canada") return mineLower === "lamaque";
    if (filter === "turkiye") return mineLower === "kisladag" || mineLower === "efemcukuru";
    if (filter === "greece") return mineLower === "olympias";
    if (filter === "exclude-canada") return mineLower !== "lamaque";
    if (filter === "exclude-turkiye") return mineLower !== "kisladag" && mineLower !== "efemcukuru";
    if (filter === "exclude-greece") return mineLower !== "olympias";
    return true;
  };

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
          {shouldShow("lamaque") && <Bar dataKey="lamaque" stackId="a" fill="#f59e0b" name="Lamaque" />}
          {shouldShow("kisladag") && <Bar dataKey="kisladag" stackId="a" fill="#10b981" name="Kışladağ" />}
          {shouldShow("efemcukuru") && <Bar dataKey="efemcukuru" stackId="a" fill="#3b82f6" name="Efemçukuru" />}
          {shouldShow("olympias") && <Bar dataKey="olympias" stackId="a" fill="#8b5cf6" name="Olympias" />}
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-3 text-sm text-zinc-400">
        Total Q2 2026: {dataInKoz[dataInKoz.length - 1].total.toFixed(1)} koz across four operating mines
      </div>
    </div>
  );
}

export function GrowthAnnualProductionChart({ id, filter }: ChartProps) {
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

export function GrowthAISCvsRealizedChart({ id, filter }: ChartProps) {
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

export function GrowthRevenueAndFCFChart({ id, filter }: ChartProps) {
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

export function GrowthMarketComparisonChart({ id, filter }: ChartProps) {
  // Hide chart if no real market data available
  if (marketPriceData.length === 0) {
    return (
      <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <h3 className="text-lg font-semibold mb-2 text-zinc-100">Market Performance Over Time</h3>
        <p className="text-xs text-zinc-500 mb-4">Yahoo Finance data fetch required</p>
        <div className="p-8 text-center text-zinc-400">
          <p className="mb-2">Run: <code className="text-zinc-300">python scripts/fetch-yahoo-market.py</code></p>
          <p className="text-sm">This will fetch market history for {company.name} from Yahoo Finance.</p>
        </div>
      </div>
    );
  }

  // Get ticker info for legend labels
  const tickers = marketDataInfo.tickers as Record<string, { symbol: string; currency: string }>;
  const tickerKeys = Object.keys(tickers);
  
  // Generate colors for each ticker
  const colors = ["#f59e0b", "#10b981", "#eab308", "#3b82f6", "#8b5cf6"];

  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-2 text-zinc-100">Market Performance Over Time</h3>
      <p className="text-xs text-zinc-500 mb-4">
        Source: Yahoo Finance, {marketDataInfo.interval} over {marketDataInfo.range} | Indexed to 100 at first close
      </p>
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
          <YAxis stroke="#888" label={{ value: 'Indexed (100 = start)', angle: -90, position: 'insideLeft', style: { fill: '#888' } }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46" }}
            labelStyle={{ color: "#e4e4e7" }}
            formatter={(value: any) => value !== null ? value.toFixed(1) : 'N/A'}
          />
          <Legend />
          {tickerKeys.map((tickerKey, idx) => {
            const ticker = tickers[tickerKey];
            const label = `${ticker.symbol} (${ticker.currency})`;
            return (
              <Line 
                key={tickerKey}
                type="monotone" 
                dataKey={tickerKey} 
                stroke={colors[idx % colors.length]} 
                name={label} 
                strokeWidth={2} 
                connectNulls 
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-3 text-sm text-zinc-400">
        Not investment advice. Data from {marketDataInfo.source}. Run <code className="text-xs">python scripts/fetch-yahoo-market.py</code> to refresh.
      </div>
    </div>
  );
}

export function GrowthSECFinancialsChart({ id }: ChartProps) {
  // Hide chart if no SEC financials available
  if (!secFinancials.available) {
    return null; // Silently hide when no data
  }

  // Extract annual revenue and net income data
  const revenueData = secFinancials.metrics.Revenues || [];
  const netIncomeData = secFinancials.metrics.NetIncome || [];

  // Merge on fiscal year
  const yearMap: Record<string, { year: string; revenue: number | null; netIncome: number | null }> = {};

  revenueData.forEach((item: any) => {
    const year = item.fiscalYear;
    if (!yearMap[year]) yearMap[year] = { year, revenue: null, netIncome: null };
    yearMap[year].revenue = item.value ? item.value / 1000000 : null; // Convert to millions
  });

  netIncomeData.forEach((item: any) => {
    const year = item.fiscalYear;
    if (!yearMap[year]) yearMap[year] = { year, revenue: null, netIncome: null };
    yearMap[year].netIncome = item.value ? item.value / 1000000 : null; // Convert to millions
  });

  const chartData = Object.values(yearMap).sort((a, b) => a.year.localeCompare(b.year));

  if (chartData.length === 0) {
    return null;
  }

  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-2 text-zinc-100">Annual Financials — Sourced from SEC</h3>
      <p className="text-xs text-zinc-500 mb-4">
        Source: SEC EDGAR {secFinancials.framework?.toUpperCase()} company facts | CIK {secFinancials.cik} | All figures $M USD
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="year" stroke="#888" />
          <YAxis stroke="#888" label={{ value: '$M USD', angle: -90, position: 'insideLeft', style: { fill: '#888' } }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46" }}
            labelStyle={{ color: "#e4e4e7" }}
            formatter={(value: any) => value !== null ? `$${value.toFixed(0)}M` : 'N/A'}
          />
          <Legend />
          <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
          <Line type="monotone" dataKey="netIncome" stroke="#10b981" name="Net Income" strokeWidth={2} connectNulls />
          <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="mt-3 text-sm text-zinc-400">
        Latest FY {chartData[chartData.length - 1]?.year}: Revenue ${chartData[chartData.length - 1]?.revenue?.toFixed(0)}M, Net Income ${chartData[chartData.length - 1]?.netIncome?.toFixed(0)}M
      </div>
    </div>
  );
}
