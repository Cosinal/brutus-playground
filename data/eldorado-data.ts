export interface PriceData {
  date: string;
  eldPrice: number;
  goldPrice: number;
}

export interface ProductionData {
  quarter: string;
  production: number;
  guidance: number;
}

export interface AISCData {
  period: string;
  mine: string;
  aisc: number;
}

export interface RampData {
  project: string;
  milestone: string;
  planned: string;
  actual: string | null;
  status: "on-track" | "achieved" | "delayed";
}

export interface MixData {
  period: string;
  goldRevenue: number;
  copperRevenue: number;
}

export interface DecisionPoint {
  category: string;
  change: string;
  impact: "positive" | "negative" | "neutral";
  detail: string;
}

// ELD/EGO price data (TSX:ELD in CAD, approximated from public sources)
// Gold price in USD/oz from public market data
export const priceData: PriceData[] = [
  { date: "2024-01", eldPrice: 14.2, goldPrice: 2040 },
  { date: "2024-04", eldPrice: 13.8, goldPrice: 2330 },
  { date: "2024-07", eldPrice: 15.4, goldPrice: 2390 },
  { date: "2024-10", eldPrice: 16.9, goldPrice: 2650 },
  { date: "2025-01", eldPrice: 18.3, goldPrice: 2720 },
  { date: "2025-04", eldPrice: 17.6, goldPrice: 2680 },
  { date: "2025-07", eldPrice: 19.2, goldPrice: 2810 },
  { date: "2025-10", eldPrice: 20.1, goldPrice: 2920 },
  { date: "2026-01", eldPrice: 21.4, goldPrice: 2980 },
  { date: "2026-04", eldPrice: 22.8, goldPrice: 3150 },
  { date: "2026-07", eldPrice: 23.5, goldPrice: 3220 },
];

// Quarterly gold production (koz) vs 2026 guidance
export const productionData: ProductionData[] = [
  { quarter: "Q1 2025", production: 98, guidance: 120 },
  { quarter: "Q2 2025", production: 104, guidance: 120 },
  { quarter: "Q3 2025", production: 118, guidance: 125 },
  { quarter: "Q4 2025", production: 125, guidance: 130 },
  { quarter: "Q1 2026", production: 101, guidance: 125 },
  { quarter: "Q2 2026", production: 104, guidance: 125 },
  { quarter: "Q3 2026 (Proj)", production: 140, guidance: 150 },
  { quarter: "Q4 2026 (Proj)", production: 155, guidance: 150 },
];

// All-In Sustaining Cost by mine/consolidated
// Q2 2026: ~$1,926/oz consolidated per company disclosure
export const aiscData: AISCData[] = [
  { period: "Q1 2025", mine: "Consolidated", aisc: 1780 },
  { period: "Q2 2025", mine: "Consolidated", aisc: 1820 },
  { period: "Q3 2025", mine: "Consolidated", aisc: 1795 },
  { period: "Q4 2025", mine: "Consolidated", aisc: 1810 },
  { period: "Q1 2026", mine: "Consolidated", aisc: 1890 },
  { period: "Q2 2026", mine: "Consolidated", aisc: 1926 },
  { period: "Q2 2026", mine: "Lamaque", aisc: 1650 },
  { period: "Q2 2026", mine: "Kisladag", aisc: 1820 },
  { period: "Q2 2026", mine: "Efemcukuru", aisc: 1280 },
  { period: "Q2 2026", mine: "Olympias", aisc: 2450 },
];

// Skouries & McIlvenna Bay ramp milestones
export const rampData: RampData[] = [
  {
    project: "Skouries",
    milestone: "First copper-gold concentrate",
    planned: "Q3 2026",
    actual: null,
    status: "on-track",
  },
  {
    project: "Skouries",
    milestone: "Commercial production",
    planned: "Q4 2026",
    actual: null,
    status: "on-track",
  },
  {
    project: "McIlvenna Bay",
    milestone: "First copper",
    planned: "June 2026",
    actual: "June 2026",
    status: "achieved",
  },
  {
    project: "McIlvenna Bay",
    milestone: "First zinc",
    planned: "July 2026",
    actual: "July 2026",
    status: "achieved",
  },
  {
    project: "McIlvenna Bay",
    milestone: "Ramp to 2,750 tpd",
    planned: "H2 2026",
    actual: null,
    status: "on-track",
  },
];

// Revenue mix (gold vs copper, estimated from production and prices)
export const mixData: MixData[] = [
  { period: "2024", goldRevenue: 92, copperRevenue: 8 },
  { period: "2025", goldRevenue: 94, copperRevenue: 6 },
  { period: "2026 H1", goldRevenue: 89, copperRevenue: 11 },
  { period: "2026 H2 (Proj)", goldRevenue: 78, copperRevenue: 22 },
];

// Decision callout: what changed this quarter
export const decisionPoints: DecisionPoint[] = [
  {
    category: "Ramp",
    change: "McIlvenna Bay achieved first copper & zinc on schedule",
    impact: "positive",
    detail: "De-risked production profile; copper exposure increasing",
  },
  {
    category: "Cost",
    change: "Q2 2026 AISC rose to $1,926/oz vs ~$1,810 in 2025",
    impact: "negative",
    detail: "Olympias high-cost; Skouries pre-commercial; watching Q3",
  },
  {
    category: "Ramp",
    change: "Skouries first concentrate targeted Q3 2026, commercial Q4",
    impact: "positive",
    detail: "Major copper-gold asset; on track to transform 2027 production mix",
  },
  {
    category: "Production",
    change: "H1 2026 production 204,974 oz; tracking to 495–600 koz FY",
    impact: "neutral",
    detail: "In-line with guidance; Q3-Q4 weighted to Skouries contribution",
  },
];

export const companyInfo = {
  name: "Eldorado Gold Corporation",
  headquarters: "Vancouver, Canada",
  tickers: "TSX: ELD, NYSE: EGO",
  operations: [
    "Lamaque (Canada)",
    "Kisladag (Türkiye)",
    "Efemcukuru (Türkiye)",
    "Olympias (Greece)",
    "Skouries (Greece)",
    "McIlvenna Bay (Canada)",
  ],
  h1_2026_production: "204,974 oz gold",
  fy_2026_guidance: "495,000 – 600,000 oz gold",
  q2_2026_aisc: "$1,926/oz",
};
