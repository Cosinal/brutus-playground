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
} from "recharts";
import { priceData, productionData, aiscData, rampData, mixData, decisionPoints } from "@/data/eldorado-data";

interface ChartProps {
  id: string;
}

export function PriceChart({ id }: ChartProps) {
  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-4 text-zinc-100">ELD Price vs Gold</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={priceData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" stroke="#888" />
          <YAxis yAxisId="left" stroke="#888" />
          <YAxis yAxisId="right" orientation="right" stroke="#888" />
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46" }}
            labelStyle={{ color: "#e4e4e7" }}
          />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="eldPrice" stroke="#f59e0b" name="ELD (CAD)" strokeWidth={2} />
          <Line yAxisId="right" type="monotone" dataKey="goldPrice" stroke="#eab308" name="Gold (USD/oz)" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ProductionChart({ id }: ChartProps) {
  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-4 text-zinc-100">Quarterly Gold Production vs Guidance</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={productionData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="quarter" stroke="#888" angle={-15} textAnchor="end" height={80} />
          <YAxis stroke="#888" />
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46" }}
            labelStyle={{ color: "#e4e4e7" }}
          />
          <Legend />
          <Bar dataKey="production" fill="#10b981" name="Production (koz)" />
          <Bar dataKey="guidance" fill="#3b82f6" name="Guidance (koz)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AISCChart({ id, chartType = "line" }: ChartProps & { chartType?: "line" | "bar" }) {
  const consolidatedData = aiscData.filter((d) => d.mine === "Consolidated");
  const mineData = aiscData.filter((d) => d.mine !== "Consolidated" && d.period === "Q2 2026");

  if (chartType === "bar" && mineData.length > 0) {
    return (
      <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <h3 className="text-lg font-semibold mb-4 text-zinc-100">AISC by Mine (Q2 2026)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={mineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="mine" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip
              contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46" }}
              labelStyle={{ color: "#e4e4e7" }}
            />
            <Bar dataKey="aisc" fill="#ef4444" name="AISC ($/oz)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-4 text-zinc-100">AISC Consolidated</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={consolidatedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="period" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46" }}
            labelStyle={{ color: "#e4e4e7" }}
          />
          <Line type="monotone" dataKey="aisc" stroke="#ef4444" name="AISC ($/oz)" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RampChart({ id }: ChartProps) {
  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-4 text-zinc-100">Skouries & McIlvenna Bay Ramp</h3>
      <div className="space-y-3">
        {rampData.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-zinc-800 rounded border border-zinc-700">
            <div className="flex-1">
              <div className="font-medium text-zinc-100">{item.project} - {item.milestone}</div>
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

export function MixChart({ id }: ChartProps) {
  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-4 text-zinc-100">Revenue Mix: Gold vs Copper</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={mixData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="period" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46" }}
            labelStyle={{ color: "#e4e4e7" }}
          />
          <Legend />
          <Bar dataKey="goldRevenue" stackId="a" fill="#eab308" name="Gold (%)" />
          <Bar dataKey="copperRevenue" stackId="a" fill="#f97316" name="Copper (%)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DecisionCallout({ id }: ChartProps) {
  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-4 text-zinc-100">What Changed This Quarter</h3>
      <div className="space-y-3">
        {decisionPoints.map((point, idx) => (
          <div key={idx} className="p-4 bg-zinc-800 rounded border border-zinc-700">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-zinc-400">{point.category}</div>
              <div
                className={`px-2 py-1 rounded text-xs font-medium ${
                  point.impact === "positive"
                    ? "bg-green-900 text-green-200"
                    : point.impact === "negative"
                    ? "bg-red-900 text-red-200"
                    : "bg-zinc-700 text-zinc-300"
                }`}
              >
                {point.impact}
              </div>
            </div>
            <div className="font-medium text-zinc-100 mb-1">{point.change}</div>
            <div className="text-sm text-zinc-400">{point.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CopperProductionChart({ id }: ChartProps) {
  const copperData = [
    { quarter: "Q1 2026", copper: 0 },
    { quarter: "Q2 2026", copper: 1.2 },
    { quarter: "Q3 2026 (Proj)", copper: 4.8 },
    { quarter: "Q4 2026 (Proj)", copper: 8.5 },
  ];

  return (
    <div id={id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-4 text-zinc-100">Copper Production (Mlbs)</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={copperData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="quarter" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46" }}
            labelStyle={{ color: "#e4e4e7" }}
          />
          <Bar dataKey="copper" fill="#f97316" name="Copper (Mlbs)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
